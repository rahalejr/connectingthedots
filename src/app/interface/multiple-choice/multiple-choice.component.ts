import { Component, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { MultipleChoice } from '../../content/models';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'multiple-choice',
    imports: [CommonModule],
    templateUrl: './multiple-choice.component.html',
    styleUrl: './multiple-choice.component.css'
})
export class MultipleChoiceComponent {

  @Input() choices!: MultipleChoice

  @Output() selected = new EventEmitter<number[]>();

  selection: number[] = [];

  selectOption(index: number) {
    this.choices?.multiple_selection ? this.selection.push(index) : this.selection = [index];
    this.selected.emit(this.selection);
  }


}
