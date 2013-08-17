#!/usr/bin/env python
# -*- coding: utf-8 -*-
############################################################
# function name: fun_page_type_pvuv
# chinese name: 站内页面流量报表
# when created: 2013-08-16
# who create: wizawu
# middle tables:
# source tables:
# result tables: 
# description: 日报
############################################################

import mkt_common

# pysql file name
pysql_filename = "mkt-report_visit-fun_page_type_pvuv.py"

# global variables
v_numfrom  = "10010101" 
v_numto    = "10010101" 
v_cycle    = "1"
v_para1    = ""
v_para2    = ""
v_charfrom = "\'\'"
v_charto   = "\'\'"
v_datefrom = "\'\'"
v_dateto   = "\'\'"   
v_numlast  = "10010101"
v_timestamp_from = -1
v_timestamp_to   = -1

def init(tdw, argv):
    global v_numfrom
    global v_numto 
    global v_cycle
    global v_para1
    global v_para2
    global v_charfrom
    global v_charto
    global v_datefrom
    global v_dateto
    global v_numlast
    global v_timestamp_from
    global v_timestamp_to
    
    if 1 == mkt_common.config(tdw, argv):
        return 1
    
    v_numfrom   = mkt_common.v_numfrom 
    v_numto     = mkt_common.v_numto
    v_cycle     = mkt_common.v_cycle
    v_para1     = mkt_common.v_para1
    v_para2     = mkt_common.v_para2
    v_charfrom  = mkt_common.v_charfrom
    v_charto    = mkt_common.v_charto
    v_datefrom  = mkt_common.v_datefrom
    v_dateto    = mkt_common.v_dateto
    v_numlast   = mkt_common.v_numlast
    v_timestamp_from = mkt_common.v_timestamp_from
    v_timestamp_to   = mkt_common.v_timestamp_to
    
    strtmp = """
        v_numfrom  = %s,
        v_numto    = %s,
        v_cycle    = %s,
        v_para1    = %s,
        v_para2    = %s,
        v_charfrom = %s,
        v_charto   = %s,
        v_datefrom = %s,
        v_dateto   = %s,
        v_numlast  = %s,
        v_timestamp_from = %s,
        v_timestamp_to   = %s
    """ % (v_numfrom, v_numto, v_cycle, v_para1, v_para2, v_charfrom, v_charto, 
           v_datefrom, v_dateto, v_numlast, v_timestamp_from, v_timestamp_to)
    mkt_common.WriteLog(tdw, pysql_filename, "init" , strtmp)
    
def execute(tdw):
    sql = """use ecc_operation"""
    mkt_common.WriteLog(tdw, pysql_filename, "running", sql)
    tdw.execute(sql)
    
    """ CREATE TABLE r_fun_page_type_pvuv (
          fdate_cd      INT,
          fclass_flag   INT,
          fclassl0_id   INT,
          fclassl1_id   BIGINT,
          fclassl2_id   BIGINT,
          fclassl3_id   BIGINT,
          fpv           BIGINT,
          fuv           BIGINT,
          fclick        BIGINT,
          fclick_pv     BIGINT,
          fclick_uv     BIGINT,
          frd_pv        BIGINT,
          frd_uv        BIGINT,
          fwg_pv        BIGINT,
          fwg_uv        BIGINT,
          fpp_pv        BIGINT,
          fpp_uv        BIGINT,
          fwg_home_pv   BIGINT,
          fwg_home_uv   BIGINT,
          fpp_home_pv   BIGINT,
          fpp_home_uv   BIGINT,
          fdetail_pv    BIGINT,
          fdetail_uv    BIGINT,
          fshop_pv      BIGINT,
          fshop_uv      BIGINT,
          fsearch_pv    BIGINT,
          fsearch_uv    BIGINT,
          fchan_pv      BIGINT,
          fchan_uv      BIGINT
        ) PARTITION BY LIST(fdate_cd) (PARTITION dafault)
    """

    sql = """
        ALTER TABLE r_fun_page_type_pvuv DROP PARTITION P_%s
    """ % v_numfrom
    mkt_common.WriteLog(tdw, pysql_filename, "running", sql)
    tdw.execute(sql)

    sql = """
        ALTER TABLE r_fun_page_type_pvuv ADD PARTITION P_%s VALUES IN(%s)
    """ % (v_numfrom, v_numfrom)
    mkt_common.WriteLog(tdw, pysql_filename, "running", sql)
    tdw.execute(sql)

    
    # 各级类型PV和UV
    t_pvuv_x = """
        SELECT
          MAX(fcurrent_url_classlev0_id)    fclassl0_id,
          MAX(fcurrent_url_classlev1_id)    fclassl1_id,
          MAX(fcurrent_url_classlev2_id)    fclassl2_id,
          MAX(fcurrent_url_classlev3_id)    fclassl3_id,
          COUNT(DISTINCT fpv_id)            fpv,
          COUNT(DISTINCT fvisit_key)        fuv
        FROM t_tree_info
        GROUP BY fcurrent_url_classlev%d_id
    """
  
    # 各级类型点击统计
    t_click_x = """
        SELECT
          MAX(fclassl0_id)              fclassl0_id,
          MAX(fclassl1_id)              fclassl1_id,
          MAX(fclassl2_id)              fclassl2_id,
          MAX(fclassl3_id)              fclassl3_id,
          COUNT(1)                      fclick,
          COUNT(DISTINCT fpvid)         fclick_pv,
          COUNT(DISTINCT fvisit_key)    fclick_uv
        FROM t_click
        GROUP BY fclassl%d_id
    """

    # 各级类型跳转统计
    t_rd_x = """
        SELECT
          MAX(frefer_url_classlev0_id)    fclassl0_id,
          MAX(frefer_url_classlev1_id)    fclassl1_id,
          MAX(frefer_url_classlev2_id)    fclassl2_id,
          MAX(frefer_url_classlev3_id)    fclassl3_id,
          COUNT(DISTINCT fpv_id)          frd_pv,
          COUNT(DISTINCT fvisit_key)      frd_uv,
          COUNT(DISTINCT (CASE WHEN fshop_type = 1 THEN fpv_id
            ELSE NULL END))    fwg_pv, 
          COUNT(DISTINCT (CASE WHEN fshop_type = 1 THEN fvisit_key 
            ELSE NULL END))    fwg_uv, 
          COUNT(DISTINCT (CASE WHEN fshop_type = 0 THEN fpv_id
            ELSE NULL END))    fpp_pv, 
          COUNT(DISTINCT (CASE WHEN fshop_type = 0 THEN fvisit_key
            ELSE NULL END))    fpp_uv, 
          COUNT(DISTINCT (CASE WHEN fcurrent_url_classlev2_id = 155 THEN fpv_id
            ELSE NULL END))    fwg_home_pv,
          COUNT(DISTINCT (CASE WHEN fcurrent_url_classlev2_id = 155 THEN fvisit_key
            ELSE NULL END))    fwg_home_uv,
          COUNT(DISTINCT (CASE WHEN fcurrent_url_classlev2_id = 101 THEN fpv_id
            ELSE NULL END))    fpp_home_pv,
          COUNT(DISTINCT (CASE WHEN fcurrent_url_classlev2_id = 101 THEN fvisit_key
            ELSE NULL END))    fpp_home_uv,
          COUNT(DISTINCT (CASE WHEN fcurrent_url_classlev1_id = 7 THEN fpv_id
            ELSE NULL END))    fdetail_pv,
          COUNT(DISTINCT (CASE WHEN fcurrent_url_classlev1_id = 7 THEN fvisit_key
            ELSE NULL END))    fdetail_uv,
          COUNT(DISTINCT (CASE WHEN fcurrent_url_classlev1_id = 8 THEN fpv_id
            ELSE NULL END))    fshop_pv,
          COUNT(DISTINCT (CASE WHEN fcurrent_url_classlev1_id = 8 THEN fvisit_key
            ELSE NULL END))    fshop_uv,
          COUNT(DISTINCT (CASE WHEN fcurrent_url_classlev1_id = 6 THEN fpv_id
            ELSE NULL END))    fsearch_pv,
          COUNT(DISTINCT (CASE WHEN fcurrent_url_classlev1_id = 6 THEN fvisit_key
            ELSE NULL END))    fsearch_uv,
          COUNT(DISTINCT (CASE WHEN fcurrent_url_classlev1_id = 4 THEN fpv_id
            ELSE NULL END))    fchan_pv,
          COUNT(DISTINCT (CASE WHEN fcurrent_url_classlev1_id = 4 THEN fvisit_key
            ELSE NULL END))    fchan_uv
        FROM t_tree_info
        GROUP BY frefer_url_classlev%d_id
    """

    sql = """
        INSERT INTO r_fun_page_type_pvuv (
          fdate_cd, fclass_flag,
          fclassl0_id, fclassl1_id, fclassl2_id, fclassl3_id, fpv, fuv,
          fclick, fclick_pv, fclick_uv, frd_pv, frd_uv, fwg_pv, fwg_uv,
          fpp_pv, fpp_uv, fwg_home_pv, fwg_home_uv, fpp_home_pv, fpp_home_uv,
          fdetail_pv, fdetail_uv, fshop_pv, fshop_uv,
          fsearch_pv, fsearch_uv, fchan_pv, fchan_uv
        )
        WITH t_class AS (
          SELECT
            DISTINCT fcurrent_url_id     fcur_id,
            fshop_type                   fclassl0_id,
            fcurrent_url_classlev1_id    fclassl1_id,
            fcurrent_url_classlev2_id    fclassl2_id,
            fcurrent_url_classlev3_id    fclassl3_id
          FROM ecc_paipai_basic::daily_raw_paipai_tree_pv_info
          WHERE fdate_cd = %s
        ), t_tree_info AS (    -- 增加current和refer页面的0级类型
          SELECT /*+ MAPJOIN(t_class) */  t1.*,
            t1.fshop_type          fcurrent_url_classlev0_id,
            t_class.fclassl0_id    frefer_url_classlev0_id
          FROM t_class JOIN (
              SELECT *
              FROM ecc_paipai_basic::daily_raw_paipai_tree_pv_info
              WHERE fdate_cd = %s
            ) t1
            ON t_class.fcur_id = t1.frefer_url_id
        ), t_click AS (    -- 增加0,1,2,3级页面类型
          SELECT /*+ MAPJOIN(t_class) */  t2.*,
            t_class.fclassl0_id,
            t_class.fclassl1_id,
            t_class.fclassl2_id,
            t_class.fclassl3_id
          FROM t_class JOIN (
              SELECT *
              FROM ecc_paipai_basic::daily_raw_paipai_click
              WHERE fdate_cd = %s
            ) t2
            ON t_class.fcur_id = t2.fcurrent_url_type_id
        ), t_pvuv_0 AS (%s
        ), t_pvuv_1 AS (%s
        ), t_pvuv_2 AS (%s
        ), t_pvuv_3 AS (%s
        ), t_click_0 AS (%s
        ), t_click_1 AS (%s
        ), t_click_2 AS (%s
        ), t_click_3 AS (%s
        ), t_rd_0 AS (%s
        ), t_rd_1 AS (%s
        ), t_rd_2 AS (%s
        ), t_rd_3 AS (%s
        ) 
        SELECT %s, * FROM (
          
        )
    """ % (v_numfrom, v_numfrom, v_numfrom, v_numfrom,
           t_rd_x % 0, t_rd_x % 1, t_rd_x % 2, t_rd_x % 3,
           t_click_x % 0, t_click_x % 1, t_click_x % 2, t_click_x % 3, 
           t_pvuv_x % 0, t_pvuv_x % 1, t_pvuv_x % 2, t_pvuv_x % 3)
    mkt_common.WriteLog(tdw, pysql_filename, "running", sql)
    tdw.execute(sql)
    
# main entry
def TDW_PL(tdw, argv=[]):
    mkt_common.WriteLog (tdw, pysql_filename, "start")
    
    # initial parameters
    if 1 == init(tdw, argv):
        return 1
                
    # execute
    execute(tdw)
    
    mkt_common.WriteLog(tdw, pysql_filename, "end")
    
    return 0

