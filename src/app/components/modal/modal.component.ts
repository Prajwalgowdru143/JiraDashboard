import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-0">
        <h2 class="text-xl font-semibold mb-4 text-center">Enter API Credentials</h2>

        <form [formGroup]="modalForm" (ngSubmit)="submitForm()">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input 
            type="email" 
            formControlName="email" 
            class="w-full p-2 border rounded mt-1 focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your email"
          />
          <div *ngIf="modalForm.controls['email'].invalid && modalForm.controls['email'].touched" class="text-red-500 text-sm">
            Invalid email format.
          </div>

          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-3">API Token</label>
          <input 
            type="password" 
            formControlName="apiToken" 
            class="w-full p-2 border rounded mt-1 focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your API Token"
          />
          <div *ngIf="modalForm.controls['apiToken'].invalid && modalForm.controls['apiToken'].touched" class="text-red-500 text-sm">
            API Token is required.
          </div>

          <div class="mt-4 flex justify-between space-x-2">
            <button type="button" (click)="closeModal()" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 w-1/2">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-1/2" [disabled]="modalForm.invalid">Save</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ email: string; apiToken: string }>();

  modalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.modalForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      apiToken: ['', [Validators.required]]
    });
  }

  submitForm() {
    console.log("Submit button clicked");
    if (this.modalForm.valid) {
      this.submit.emit(this.modalForm.value);
      this.closeModal();
    } else {
      console.log("Form is invalid");
    }
  }

  closeModal() {
    console.log("Modal close clicked");
    this.close.emit();
  }
}
