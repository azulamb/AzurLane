/// <reference path="../components/skill-exp.ts" />

declare const SKILL_EXP: number[];
declare const BOOKS: {
	rarity: number;
	hours: number;
	exp: number;
	bonus: number;
}[];

function DrawSkillLvUp(parent: SkillExpElement) {
	setTimeout(() => {
		parent.exp = SKILL_EXP;
		BOOKS.forEach((item) => {
			const book = new (<{ new (): SkillBookElement }> customElements.get('skill-book'))();
			book.rarity = item.rarity;
			book.hours = item.hours;
			book.exp = item.exp;
			book.bonus = item.bonus;
			parent.appendChild(book);
		});
	}, 0);
}
