const Common = {
	tr: (option: { id?: string; class?: string | string[] }, ...columns: HTMLTableCellElement[]) => {
		const tr = document.createElement('tr');
		if (option) {
			if (option.id) {
				tr.id = option.id;
			}
			if (option.class) {
				const list = typeof option.class === 'string' ? [option.class] : option.class;
				tr.classList.add(...list);
			}
		}
		columns.forEach((td) => {
			tr.appendChild(td);
		});
		return tr;
	},
	td: (content: string | HTMLElement, option?: { class?: string | string[]; colSpan?: number; rowSpan?: number; isHTML?: boolean }) => {
		const td = document.createElement('td');
		if (typeof content === 'string') {
			if (option && option.isHTML) {
				td.innerHTML = content;
			} else {
				td.textContent = content;
			}
		} else {
			td.appendChild(content);
		}
		if (option) {
			if (option.class) {
				const list = typeof option.class === 'string' ? [option.class] : option.class;
				td.classList.add(...list);
			}
			if (option.colSpan) {
				td.colSpan = option.colSpan;
			}
			if (option.rowSpan) {
				td.rowSpan = option.rowSpan;
			}
		}
		return td;
	},
};
