import { View } from 'src/utils/view';
import { ViewTemplate } from '../../utils/viewTemplate';
import html from '../hints/hints.tpl.html';
import { addElement } from '../../utils/helpers';
import { Hint } from 'types';
export class SearchHints {
  view: View;
  hints!: Hint[];

  constructor() {
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  update(hints: Hint[]) {
    this.hints = hints;
    this.render();
  }

  render() {
    addElement(this.view.root, 'span', { innerText: 'Например, ' });
    const threeHints = this.hints.slice(0, 3);
    threeHints.forEach((hint: Hint, index: number) => {
      addElement(this.view.root, 'a', { className: 'hint', innerText: hint.text, href: hint.href });
      if (index == 0) {
        addElement(this.view.root, 'span', { innerText: ', ' });
      } else if (index == 1) {
        addElement(this.view.root, 'span', { innerText: ' или ' });
      }
    });
  }
}
