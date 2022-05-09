const Common = {
	tr: (option: { class?: string | string[] }, ...columns: HTMLTableCellElement[]) => {
		const tr = document.createElement('tr');
		if (option) {
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
	td: (content: string, option?: { class?: string | string[]; colSpan?: number; rowSpan?: number }) => {
		const td = document.createElement('td');
		td.textContent = content;
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
