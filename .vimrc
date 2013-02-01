" common
set autoindent
set backspace=2
set expandtab
set number
set shiftwidth=4
set smartindent
set smarttab
set softtabstop=4
set tabstop=4
set textwidth=80
set fileencodings=ucs-bom,utf-8,cp936,gb18030,big5,euc-jp,euc-kr,latin1
set mouse=a
imap <C-e> <C-x><C-o>
autocmd VimEnter * hi MatchParen ctermbg=darkblue

" GUI
set guifont=Oxygen\ Mono\ 9
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

" golang
set rtp+=/usr/share/go/misc/vim

" plugins
filetype indent on
filetype plugin on
syntax on
