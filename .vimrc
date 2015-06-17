" common
set number
set autoindent
set smartindent
set expandtab
set smarttab
set shiftwidth=4
set tabstop=4
set backspace=2
set encoding=utf-8
set fileencodings=ucs-bom,utf-8,cp936,gb18030,big5,euc-jp,euc-kr,latin1
inoremap <C-e> <End>
inoremap <C-f> <C-x><C-o>
nnoremap te :tabedit 
nnoremap < :tabp<CR>
nnoremap > :tabn<CR>
autocmd VimEnter * hi MatchParen ctermbg=darkblue

" fold
set foldmethod=syntax
set foldlevelstart=99
let javaScript_fold=1

" GUI
set guifont=Source\ Code\ Pro\ 10
set guioptions-=m
set guioptions-=r
set guioptions-=T
set t_Co=256

" Align
nmap <C-a>00 :AlignCtrl p0P0<CR>
nmap <C-a>01 :AlignCtrl p0P1<CR>
nmap <C-a>10 :AlignCtrl p1P0<CR>
nmap <C-a>11 :AlignCtrl p1P1<CR>

" colorscheme
if has('gui_running')
    colorscheme solarized
    set background=dark
else
    colorscheme dante
endif

" vundle
set nocompatible
filetype off
set rtp+=/home/wiza/.vim/bundle/vundle/
call vundle#rc()
Plugin 'gmarik/vundle'
Plugin 'tsaleh/vim-align'
Plugin 'mattn/emmet-vim'
Plugin 'xolox/vim-misc'
Plugin 'xolox/vim-lua-ftplugin'
" Plugin 'nsf/gocode', {'rtp': 'vim/'}
" Plugin 'Valloric/YouCompleteMe'

" plugins
let g:lua_complete_omni = 1
let g:lua_define_completion_mappings = 0
let g:user_emmet_leader_key='<C-b>'
let g:ycm_autoclose_preview_window_after_completion = 1
let g:ycm_filepath_completion_use_working_dir = 1
let g:ycm_global_ycm_extra_conf = '/home/wiza/.vim/bundle/YouCompleteMe/cpp/ycm/.ycm_extra_conf.py'

filetype indent on
filetype plugin on
syntax on
