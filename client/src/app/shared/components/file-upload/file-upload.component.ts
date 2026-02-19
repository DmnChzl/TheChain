import { Component, computed, input, output, signal } from '@angular/core';
import { isValidFileExtension, isValidFileMimeType } from '@app/shared/utils/fileUtils';
import { CloudArrowIconComponent } from '../icons';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CloudArrowIconComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  description = input('Lorem ipsum dolor sit amet');

  allowedExtensions = input<string[]>([]);
  allowedMimeTypes = input<string[]>([]);
  maxSize = input(10);

  fileSelected = output<File>();
  invalidated = output<string>();

  isDragging = signal(false);

  readonly acceptedFiles = computed(() => {
    const extensions = this.allowedExtensions();
    const mimeTypes = this.allowedMimeTypes();

    if (extensions.length === 0 && mimeTypes.length === 0) return '';
    return [...extensions, ...mimeTypes].filter(Boolean).join(',');
  });

  private validateFile(file: File): boolean {
    const extensions = this.allowedExtensions();
    const mimeTypes = this.allowedMimeTypes();

    if (extensions.length > 0 && !isValidFileExtension(file.name, extensions)) {
      this.invalidated.emit('Unauthorized File! Reason: Format');
      return false;
    }

    if (mimeTypes.length > 0 && !isValidFileMimeType(file.type, mimeTypes)) {
      this.invalidated.emit('Unauthorized File! Reason: Format');
      return false;
    }

    const maxSizeBytes = this.maxSize() * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.invalidated.emit('Unauthorized File! Reason: Size');
      return false;
    }

    return true;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const [file] = event.dataTransfer?.files ?? [];
    if (file && this.validateFile(file)) {
      this.fileSelected.emit(file);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const [file] = input.files ?? [];
    if (file && this.validateFile(file)) {
      this.fileSelected.emit(file);
    }
  }
}
