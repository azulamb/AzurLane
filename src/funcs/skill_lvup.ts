/// <reference path="../components/skill-exp.ts" />

declare const SKILL_EXP: number[];
declare const BOOKS: {
	rarelity: number;
	hours: number;
	exp: number;
	bonus: number;
}[];

function DrawSkillLvUp(parent: SkillExpElement) {
	setTimeout(() => {
		parent.exp = SKILL_EXP;
		BOOKS.forEach((item) => {
			const book = new (<{ new (): SkillBookElement }> customElements.get('skill-book'))();
			book.rarelity = item.rarelity;
			book.hours = item.hours;
			book.exp = item.exp;
			book.bonus = item.bonus;
			parent.appendChild(book);
		});
	}, 0);
}
