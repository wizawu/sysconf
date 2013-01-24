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

" GUI
set guifont=Consolas\ 10
set guioptions-=m
set guioptions-=r
set guioptions-=T
set t_Co=256

" colorscheme
if has('gui_running')
    colorscheme solarized
    set background=dark
else
    colorscheme emacs
endif

" golang
set rtp+=/usr/share/go/misc/vim

" plugins
filetype indent on
filetype plugin on
syntax on
