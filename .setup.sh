
_o1_gitbranch() {
	git branch | grep '^* ' | cut -c 3-
}

if [ -z "${msw}" ]; then
	export msw=1
	export PS1="(msw/\$(_o1_gitbranch)) ${PS1}";
	export PATH=/usr/local/node-v10.13.0-linux-x64/bin/:$PATH
fi

