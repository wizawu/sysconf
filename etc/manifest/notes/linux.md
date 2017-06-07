最初把Linux介紹給我的是[liuexp](https://github.com/liuexp)，我在Ubuntu的網站上申請了幾次免費CD，一直都沒有收到。真正開始在Linux下編程是在某個陽光明媚的中午，看到[糯米](http://www.cppblog.com/varg-vikernes/)師兄演示了如何編譯 <i>Hello, world</i> 之後。再不久，我便萌生了開發 <i>wiza-1.0</i> 的念頭 ── 至今這個Live Linux仍然只有1.0的版本。無論在C++實訓優秀作品展上還是日後，我一直不願談論這個Live Linux是怎麽開發出來的，唯一的原因是成品離我的預期太遠。但是一直以來我的這份作業都被訛傳得神乎，在 <i>Attack on Linux</i> 的第一話，我把來龍去脈說一下。<br />

<b>計算機是怎麽啟動的(Linux + GRUB)</b>

+ CPU從ROM讀取BIOS開機程序，執行Power-On Self-Test(POST)
+ 按BIOS設置的順序讀取可啟動設備的MBR，根據MBR的代碼讀取boot loader所在扇區
+ Boot loader被加載到內存并運行，繼而找到內核(vmlinuz)和[initramfs](https://wiki.ubuntu.com/Initramfs)(或[initrd](http://en.wikipedia.org/wiki/Initrd))
+ 最後是init和各種系統service的啟動，用戶登錄

initramfs和initrd有什麽用途呢？簡單的說，是一個加載到內存的臨時根目錄，幫助進行檢測硬件、加載模塊以及挂載真正的文件系統。為什麽不直接使用真正的根目錄呢？仔細想想，這是一個雞和雞蛋的問題(上面initramfs的文字鏈接有詳述)。<br />

<b>我的Live Linux是怎樣煉成的</b>

+ 下載Debian-5.0，解壓(主要改動文件 filesystem.squashfs&ensp;initrd2.img&ensp;vmlinuz2)
+ 下載Linux-3.0，編譯，替換initrd2.img和vmlinuz2
+ 解壓filesystem.squashfs，chroot，修改配置，添加軟件
+ 重新壓縮成ISO，用QEMU啟動測試

<b>進入Linux的希干希納區</b><br />
剛接觸Linux時我們最納悶的，毫無疑問是“凌亂”的系統目錄。

+ <i>/boot</i>&ensp;下面的文件上文已經提及
+ <i>/bin</i>&ensp;系統啟動以及單用戶模式下必不可少的可執行文件
+ <i>/sbin</i>&ensp;需要root權限運行的程序和工具，例如fsck和mkfs
+ <i>/usr/bin&ensp;/usr/sbin</i>&ensp;用戶安裝軟件後通常可以在這裏找到可執行文件
+ <i>/usr/include</i>&ensp;C/C++程序可用尖括號include的文件
+ <i>/usr/lib</i>&ensp;各種靜態鏈接庫和動態鏈接庫
+ <i>/etc</i>&ensp;存放系統和大多數用戶安裝軟件的配置文件
+ <i>/dev</i>&ensp;Linux下一切皆文件，這裏就體現得淋漓盡致
+ <i>/proc</i>&ensp;可讀取系統狀態信息，查看或修改系統設置
+ <i>/sys</i>&ensp;層次化地表示系統中的設備和內核對象
+ <i>/tmp</i>&ensp;臨時文件，例如點擊下載鏈接時選擇“打開”，文件會先保存到這裏
+ <i>/var</i>&ensp;程序運行時生成的日志、鎖、緩存等
+ <i>/usr/share</i>&ensp;一些非功能性的資源，如幫助文檔、Vim的顏色方案、壁紙等
+ <i>/usr/share/fonts&ensp;~/.fonts</i>&ensp;字體目錄

<b>你需要知道的/dev</b><br />
設備文件用于訪問擴展設備，但不會關聯到磁盤或其他存儲設備介質的數據端。幾乎所有發行版都由守護進程 <i>udevd</i> 管理/dev的內容(存儲在tmpfs)。在系統啟動或運行期間，當內核檢測到有新設備接入，就會向用戶空間發送一個熱拔插消息，udevd監聽到消息後就會注冊該設備，在/dev下創建對應項。<br />

<b>你需要知道的/proc</b><br />
procfs是一種虛擬文件系統，只在讀取文件內容時才會動態生成相應的信息，通常可以使用 <i>echo</i> 和 <i>cat</i> 來進行交互或者是 <i>sysctl</i> 程序。/proc包含了[非常多的系統信息](http://www.centos.org/docs/4/html/rhel-rg-en-4/s1-proc-directories.html)：

+ /proc/${pid}/：cmdline&ensp;fd&ensp;io&ensp;limit&ensp;maps&ensp;status&ensp;...
+ /proc/sys/：一大波的系統設置(注意是 <i>設置</i>，不僅僅查看)&ensp;kernel&ensp;fs&ensp;net&ensp;vm&ensp;...
+ 其他目錄可“望文生義”

<b>你可能不知道的/sys</b><br />
sysfs已經成為老式的ioctl機制的一種替代品，通過層次化地組織內核對象(<i>kobject</i>)，提供查看和修改內核內部數據結構的能力。每個kobject在sysfs中都表示為一個目錄，其屬性表示為目錄中的文件。和procfs一樣，讀寫sysfs文件只需要一個簡單的shell命令。<br />

<u>這些就是所謂的“一切皆文件”。</u><br />

關于/tmp的一點提醒，這個目錄的文件系統也是tmpfs，所以不要在這個路徑下進行跟磁盤I/O相關的基准測試。另外，tmpfs和ramfs不同于：

+ tmpfs需指定固定的文件系統大小；使用swap；存儲達到上限提示寫錯誤
+ ramfs動態擴容；不使用swap；存儲達到物理內存上限仍會寫入

轉載時請標明出處以便反饋錯漏 [wiza.tumblr.com](http://wiza.tumblr.com)
說到進程，每本教科書都有這麽一些概念：

+ 軟/硬實時進程
+ 搶占式多任務處理
+ 進程地址空間
+ 上下文切換
+ 僵尸進程

先來幾個小問題

+ `printf("%p\n", x);`輸出的地址是物理地址還是虛擬地址？
+ 虛擬地址空間是怎樣劃分成內核空間和用戶空間(考慮32位和64位)？
+ [一個多線程的進程在用戶空間有幾個PID可見](http://stackoverflow.com/questions/9305992/linux-threads-and-process)？
+ `pthread_self()`[返回的ID在進程間是否唯一](http://stackoverflow.com/questions/14125641/can-the-thread-id-of-a-multithreaded-process-be-the-same-as-the-process-id-of-an/)？

<b>進程地址空間</b><br />
包括了以下幾個區域，但是分布位置因體系結構而异(具體可查看proc)，通常text段從最低的地址開始，堆靠近低端，棧靠近高端。除此，其他段分別存儲著動態庫，環境變量和命令行參數，文件的 <i>內存映射</i> (這裏指的是不同結構體系各自實現的系統調用sys_mmap/sys_mmap2，即C標准庫mmap/mmap2的底層調用)等。上述都是教科書內容，如果沒有去進一步了解，你可能不知道：

+ text段會加載整個程序的二進制代碼嗎？&ensp;不會，假定二進制文件非常巨大，只有在用戶明確要求或程序自身顯式請求時才會加載相應的代碼。
+ 當進程打開磁盤上的文件時，文件內容會全部加載到內存嗎？&ensp;不會，但是整個文件會映射到虛擬地址空間，只有文件末尾的數據會讀取到內存中，以及文件開始處在磁盤上的信息。

<b>寫時復制</b><br />
很多情況下父進程調用fork後子進程會立即調用exec加載新的程序，如果在fork執行時復制父進程所有的數據到子進程，既浪費內存又浪費時間，于是內核引進COW(Copy On Write)技術，在執行fork的時候，只復制頁表到子進程，這樣父子進程的地址空間都指向了相同的物理內存頁。當一個進程試圖向共享只讀的內存頁寫入，內存先把該內存頁的數據復制到一個新頁，然後從 <i>逆向映射</i> (下一話介紹)中刪除原來的只讀頁，把新頁添加到頁表和逆向映射，然後更新CPU的高速緩存，至此進程可以向新頁寫入數據。<br />

<b>上下文切換</b><br />
查看進程上下文切換
<pre><code>watch -tdn1 cat /proc/654/status    # 最後兩行</code></pre>
可以看到上下文切換有 <i>voluntary</i> 和 <i>nonvoluntary</i> 兩種，對于SMP，前者是由于 <i>local timer interrupt</i> 觸發CPU進行調度，後者則是由更廣泛的中斷引起。<br />

<b>中斷</b><br />
切換到內核態的三種方式(搶占能力弱到強)

+ 系統調用：普通進程此時不會被調度
+ 內核搶占(2.5新增特性)：可搶占系統調用
+ 中斷：最高優先級處理

中斷在什麽時候發生？&ensp;一種是由于運行時發生的程序設計錯誤(除零、除法溢位等)，或者是缺頁异常等系統特性引發的中斷，這些被稱為 <i>內部中斷</i> 或 <i>同步中斷</i>，可以借助內核進行修復。很容易聯想到另外一種中斷叫 <i>外部中斷</i> 或 <i>异步中斷</i>，即經常被提及的有外部設備<u>引起</u>的中斷，例如鍵盤輸入、網卡接收到新的分組等。每種中斷都有一個編號。<br />

內核會怎樣處理中斷？&ensp;中斷并不會由外部設備直接產生，而是由中斷控制器將中斷請求(IRQ)轉發到CPU的中斷輸入，CPU得知中斷發生後，將進一步的處理委托給一個中斷服務例程(ISR)，該例程可能會修復故障，提供專門的處理或將外部事件通知用戶進程。<br />

如果處理中斷時發生其他的中斷？&ensp;這裏必須提到外部中斷更加細致的分類：可屏蔽(maskable)中斷，不可屏蔽(non-maskable)中斷。前者發生時會根據CPU的中斷標志判斷是否可以執行ISR，而後者發生時都會執行ISR處理。同時，ISR的設計必須符合這兩個要求：盡可能快速處理；和其他ISR同時執行時不能幹擾彼此。然而，僅僅如此并未能完全解決處理中斷的沖突，當需要處理的中斷數量較多或耗時較長，一些未被及時響應的中斷就會丟失，所以需要一種機制來保証ISR重要的操作(稱為 <i>上半部</i> )被盡快執行，可延時的操作(稱為 <i>下半部</i> )在時間充裕時執行。<br />

<b>軟中斷來了！</b>&ensp;軟中斷典型的應用就是執行延遲的下半部，默認情況下系統可以使用32個軟中斷，每個處理器都分配了守護進程(ksoftirqd)來執行軟中斷。基于softirq實現的延遲執行機制有tasklet和工作隊列(work queue)，已被廢棄的一個機制也叫下半部(bottom half)。多個處理器可以同時執行不同的softirq，同一個softirq也可以被不同的處理器調度(因此ISR的設計需要考慮線程安全和臨界區保護)，而一個tasklet只能在一個處理器上執行，所以在SMP機器上立分高下。
<pre><code>struct tasklet_struct {
    struct tasklet_struct *next;
    unsigned long state;
    atomic_t count;
    void (*func)(unsigned long);
    unsigned long data;
};</code></pre>

如何綁定特定的中斷到特定的處理器上呢？
<pre><code>ls /proc/irq/    # 所有中斷編號
cat /proc/irq/17/smp_affinity</code></pre>
如果輸出0f(二進制的00001111)，即編號為17的中斷會由CPU 0123處理。<br />

<b>資源限制</b><br />
修改資源限制遇到`Operation not permitted`和`sudo: ulimit: command not found`
<pre><code>sudo -i
ulimit -n 10000
exec su wiza
或者
sudo sh -c 'ulimit -n 10000 && exec su wiza'</code></pre>

轉載時請標明出處以便反饋錯漏 [wiza.tumblr.com](http://wiza.tumblr.com)
內存管理的很多設計技巧在于數據結構。
<pre><code>include/linux/mm_types.h</code></pre>

<b>VMA</b><br />
vm_area_struct是進程地址管理最重要的結構。這個結構記錄了一個虛擬內存區域的起始地址和結束地址(之後的第一個字節的地址)。每個進程的vm_area_struct都由鏈表和紅黑樹共同管理。鏈表將所有的區域按起始地址遞增次序連接，當進程空間存在大量離散的區域時，利用鏈表查找非常低效，因此內核會同時維持以VMA起始地址為鍵值的紅黑樹，樹的結點包含指向vm_area_struct的指針。<br />

<b>可換出頁</b><br />

+ 匿名映射的頁，私有映射的頁
+ 進程堆的頁(malloc又使用了brk系統調用和匿名映射)
+ 用于實現進程間通信機制的頁
+ 由內核本身使用的頁決不會換出(避免增加內核代碼復雜性)
+ 將外設映射到內存的頁不會換出

<b>逆向映射</b><br />
內核2.4在換頁時，需要遍歷所有進程的頁表，找到映射該頁的每一個進程，更新相應的頁表條目。當系統中進程較多時，共享頁的換出會非常低效。關于逆向映射的實現，很多人的認知還停留在類似developerWorks 2004年[這篇文章](http://www.ibm.com/developerworks/cn/linux/l-mem26/index.html)介紹的那個階段，就是“內存管理器為每個物理頁建立了一個鏈表，包含了指向當前映射那個頁的每一個進程的頁表條目的指針”。事實上，現在內核使用的是 <i>基于對象的逆向映射</i>，即在頁和進程之間插入了一個對象(很容易能猜到是VMA)，目的很明確，就是為了減少內存開銷。<br />

<b>高端內存</b><br />

如果你只關心64位系統，可以跳過這節。在32位系統上，訪問內核空間時，如果虛擬地址與內核區域的起始地址之間的偏移量不超過可用物理內存的長度(理論為1GiB，在IA-32系統為896MiB)，內核地址偏移量從0xC0000000開始，則虛擬地址X會映射到X+0xC0000000，即作一個簡單的線性平移。如果物理內存大于896MiB，內核就需要借助于高端內存(highmem)，使用kmap將高端內存頁映射到內核虛擬地址空間中。高端內存較常見的用途是 <i>Highmem PTE</i> (內核配置選項)，將頁表條目存放在高端內存，讓出更多的低端內存給其他內核數據結構。<br />

<b>夥伴系統和slab</b><br />

Linux分配內存(這裏說的都是連續的物理內存)的方法是，創建一系列的內存對象池，每個池中的內存塊大小都是一致的，處理分配請求時，就在包含足夠大的內存塊的池中傳遞一個整塊給請求者。夥伴系統和slab都是基于這個設計思想，具體實現到處都可以找到，也可以參考Memcache的源代碼。夥伴系統分離開對不同內存域(即區分開DMA、高端內存域等)的內存管理，API只支持分配2的整數冪個頁。slab(最早是在Solaris 2.4中實現)則是基于夥伴系統作更細粒度的內存分配和內存塊對象的緩存(重新利用)。kmalloc和kfree實現為slab分配器的前端，現在kmalloc分配內存最大的長度為4MiB，教科書說的128KiB已成為過去式。
<pre><code>cat /proc/buddyinfo
cat /proc/slabinfo</code></pre>

<b>bootmem</b><br />

系統運行時間(uptime)越長，內存碎片化越明顯，分配連續的大內存區域的可能性越小，所以如果想獲得大量連續的內存頁(物理頁幀)，可以在系統引導時“搶先”分配。這裏進行的內存分配并未使用到夥伴系統或者slab，而是bootmem分配器，使用的分配策略是 <i>first-fit</i>，主要的API是`alloc_bootmem`，返回的內存首地址通過EXPORT_SYMBOL導出。但是用bootmem申請內存的代碼需要鏈接到內核的代碼中，需要重新編譯內核。另一種辦法是通過設置內核引導參數預留低端內存，例如物理內存大小為256MiB，設置參數`mem=248M`，系統就會保留低端的8MiB，後續可以調用ioremap使用這段內存。<br />

<b>大內存頁</b><br />

IA-32系統的標准頁大小為4KiB，如果要映射1GiB的內存，將會用到262144個頁表項。在如今64位的系統上，8GiB以上的內存大小已是很常見，在運行數據庫(尤其是內存數據庫)等內存開銷較大的程序時，頁表項很可能達到數百萬個，如果還有大量動態庫依賴時，情況會更糟糕。于是內核2.6引進了大內存頁的特性(CONFIG_HUGETLB_PAGE和CONFIG_HUGETLBFS選項)，但是只能用于匿名頁。
<pre><code>cat /proc/meminfo | grep Huge
echo 4 > /proc/sys/vm/nr_hugepages    # 分配4個大內存頁</code></pre>
如何使用大內存頁？&ensp;mmap的參數flags需要位或MAP_ANON和MAP_HUGETLB<br />

<b>zswap</b>

<pre><code>mm/zswap.c
drivers/staging/zsmalloc/</code></pre>
[zswap](http://lwn.net/Articles/528817/)剛剛進入了內核3.11，是一個輕量的換頁緩存。當進程的頁需要換出時，不直接寫到交換區，而且將頁面壓縮放到一個動態分配(zsmalloc)的內存池。內存池使用LRU的管理策略，當內存池達到限制的大小時，才將頁面寫出到交換區。zswap的目的就是犧牲CPU周期來減少I/O次數。<br />

轉載時請標明出處以便反饋錯漏 [wiza.tumblr.com](http://wiza.tumblr.com)
<b>文件系統生死攸關的/etc/fstab</b><br />
fstab記錄了啟動時挂載設備分區的使用選項，由mount讀取，具體介紹可以閱讀[Wikipedia](http://en.wikipedia.org/wiki/Fstab)和[ArchWiki](https://wiki.archlinux.org/index.php/Fstab)，這裏只提及影響讀寫性能的atime/noatime/relatime選項。訪問時間atime會在兩處出現，一是磁盤上的inode，另外是stat結構體(在`bits/stat.h`定義)中的數據成員，若fstab中的選項為atime，每次讀文件時都會更新訪問時間，由此“讀”觸發了“寫”(即使是從頁緩存讀)。這對于服務器的某些資源文件完全沒有必要。內核2.6.30以後默認的選項是relatime，即在讀文件(或其他訪問操作)時檢查mtime是否大于atime，如果大于則更新atime(mtime是最後修改文件內容的時間，ctime是最後修改文件內容或屬性的時間)。如果分區上所有文件的atime都不重要，也可以考慮使用noatime選項。不過，如果atime上次更新在1天前，不管是atime/relatime/noatime，當前訪問都會更新atime(也是2.6.30之後的特性)。<br />

<b>open()樸素迷離的flags</b>

+ 如果相同路徑的文件可能被不同進程同時創建，需要用`O_CREAT`和`O_EXCL`
+ `O_LARGEFILE`在64位系統上已默認使用，大文件(2GiB以上)讀寫已經不成問題
+ `O_SYNC`導致寫操作非常的慢，如果必須同步到磁盤，考慮合并寫、手動fdatasync或者`O_DIRECT`
+ `O_DIRECT`需要借助memalign()，posix_memalign()或者C11標准庫的aligned_alloc()，某些系統會沒有memalign()

Direct I/O參考代碼，注意buf對齊512倍數，調用write()時offset為512倍數，寫的字節數為512倍數
<pre><code>fd = open("temp", ...|O_DIRECT, ...);
/* lseek(fd, 512 * k, SEEK_SET); */
int bufsz = 1 &lt;&lt; 14;  /* 512倍數 */
char *buf = (char*) aligned_alloc(512, bufsz);
/* fill buf */
write(fd, buf, bufsz);</code></pre>

順序寫512MiB的比較
<code><pre>Non-Sync | fdatasync | O_DIRECT
---------|-----------|---------
  1.39s  |   11.45s  |  9.49s  </code></pre>

<b>fprintf和write混用的陷阱</b>
<pre><code>int main() {
    fprintf(stdout, "Everything you and I do springs from two motives: ");
    write(STDOUT_FILENO, "the sex urge and the desire to be great.\n", 41);
}</code></pre>

write()會把輸出直接送到內核buffer，而fprintf會先緩存到用戶空間的buffer，因此這個程序的輸出結果會“不如人意”。<br />

<b>寫屏障</b><br />
請看譯言網的《[利用寫屏障和日志校驗來拯救你的數據](http://article.yeeyan.org/view/156578/111995)》<br />
% THIS POST IS STILL A DRAFT %<br />

[The Secret to 10 Million Concurrent Connections - The Kernel is the Problem, Not the Solution](http://highscalability.com/blog/2013/5/13/the-secret-to-10-million-concurrent-connections-the-kernel-i.html)<br />
說一些比較認可的做法

+ 不要把線程當作數據包來調度。其他細粒度的調度同理。
+ 不要散亂地申請內存放置數據，然後濫用指針去訪問。每次跟蹤一個指針都會造成一次高速緩存的缺失。
+ 將相繼訪問的數據放在連續的內存中，同樣可以減少內存缺失。
+ 當內存中存放了大量數據并需要頻繁的查詢訪問，考慮壓縮數據，或者根據高速緩存的大小設計高效的數據結構，而不是把二叉搜索樹當作銀彈。
+ 考慮使用大內存頁。

[When should one use a spinlock instead of mutex?](http://stackoverflow.com/questions/5869825/when-should-one-use-a-spinlock-instead-of-mutex/5870415)<br />
[When is pthread_spin_lock the right thing to use (over e.g. a pthread mutex)?](http://stackoverflow.com/questions/6603404/when-is-pthread-spin-lock-the-right-thing-to-use-over-e-g-a-pthread-mutex)<br />
[Comparing the performance of atomic, spinlock and mutex](http://demin.ws/blog/english/2012/05/05/atomic-spinlock-mutex/)<br />
[Pthreads并行编程之spin lock与mutex性能对比分析](http://www.parallellabs.com/2010/01/31/pthreads-programming-spin-lock-vs-mutex-performance-analysis/)<br />
關于自旋鎖和互斥量的一些比較，大家的觀點都比較的統一，再總結一下：

+ 自旋鎖忙等占用CPU，互斥量耗費過多的上下文切換
+ 使用自旋鎖要求臨界區的代碼盡可能短
+ 受中斷、內核搶占、運行優先級等因素的影響，使用自旋鎖可能會浪費過多的CPU時間進行忙等
+ 如果對性能要求不高，更多考慮使用互斥量

測試環境: Intel(R) Core(TM) i5 M450 @2.40GHz <br />
測試I：4個線程對初始為0的value分別進行25,000,000次加1，最後輸出100,000,000 <br />
結果：`pthread_spin_lock(11s) < pthread_mutex_lock(14s) < std::mutex(18s)` <br />
測試II：8個線程對初始為0的value分別進行12,500,000次加1，最後輸出100,000,000 <br />
結果：`pthread_mutex_lock(16s) <  std::mutex(20s) < pthread_spin_lock(24s)` <br />

[这里](http://blog.memsql.com/common-pitfalls-in-writing-lock-free-algorithms/)还有MemSQL团队关于Lock-Free算法的一个讨论和评测，结论见仁见智吧<br />

轉載時請標明出處以便反饋錯漏 [wiza.tumblr.com](http://wiza.tumblr.com)
