import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [CommonModule],
})
export class ModalComponent {
  @Output() deleteConfirmed = new EventEmitter<void>();
  isVisible = false;

  openModal() {
    this.isVisible = true;
  }

  closeModal(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.isVisible = false;
  }

  confirmDelete() {
    this.deleteConfirmed.emit();
    this.closeModal();
  }
}