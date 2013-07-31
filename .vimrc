" common
set number
set autoindent
set smartindent
set expandtab
set smarttab
set shiftwidth=2
set tabstop=2
set backspace=2
set textwidth=80
set fileencodings=ucs-bom,utf-8,cp936,gb18030,big5,euc-jp,euc-kr,latin1
imap <C-f> <C-x><C-o>
imap <C-e> <End>
autocmd VimEnter * hi MatchParen ctermbg=darkblue

" GUI
" set guifont=Oxygen\ Mono\ 9
set guifont=LetterGothicMono\ 10
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

" clang_complete
let g:clang_complete_auto=2
let g:clang_close_preview=1

" vundle
set nocompatible
filetype off
set rtp+=~/.vim/bundle/vundle/
call vundle#rc()
Bundle 'gmarik/vundle'
Bundle 'Valloric/YouCompleteMe'

" YCM
let g:ycm_global_ycm_extra_conf = '/home/wiza/.vim/bundle/YouCompleteMe/cpp/ycm/.ycm_extra_conf.py'
let g:ycm_autoclose_preview_window_after_completion = 1

" plugins
filetype indent on
filetype plugin on
syntax on
