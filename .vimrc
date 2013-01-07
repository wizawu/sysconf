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
set guifont=Consolas\ 10
set guioptions-=m
set guioptions-=r
set guioptions-=T
if has('gui_running')
    colorscheme solarized
    set background=dark
else
    colorscheme peachpuff
endif
set t_Co=256

filetype plugin on
syntax on
