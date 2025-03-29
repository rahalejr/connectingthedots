import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MultipleChoice } from '../../content/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'multiple-choice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiple-choice.component.html',
  styleUrl: './multiple-choice.component.css'
})
export class MultipleChoiceComponent {

  @Input() choices: MultipleChoice | undefined = {
    options: [
        "Help me apply for crop insurance",
        "Give me information on how to contact FEMA for emergency financial assistance",
        "Direct me to another farmer who has been hit by a similar catastrophe, so I don’t feel so alone.",
        "Connect me with other farmers in similar straits to organize a protest against government inaction to protect us from such devastating damage to our means of livelihood."
    ],
    answer: undefined,
    question: "Placeholder question text"
  }

  @Output() selectedOption = new EventEmitter<number>();

  selectedIndex?: number;

  selectOption(index: number) {
    this.selectedIndex = index;
    this.selectedOption.emit(index);
  }


}
