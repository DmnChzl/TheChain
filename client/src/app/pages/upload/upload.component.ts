import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadComponent } from '@shared/components/file-upload';
import { DiamondIconComponent } from '@shared/components/icons';
import { NotificationComponent } from '@shared/components/notification';
import { MainLayoutComponent } from '@shared/layouts/main';
import { BlockChainService } from '@shared/services/blockchain.service';
import { NotificationService } from '@shared/services/notification.service';
import { BlockChainWidgetComponent } from './components/blockchain-widget';
import { FileInfoComponent } from './components/file-info';
import { FileRecordService } from './services/file-record.service';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [
    MainLayoutComponent,
    BlockChainWidgetComponent,
    DiamondIconComponent,
    FileUploadComponent,
    NotificationComponent,
    FileInfoComponent,
  ],
  providers: [FileRecordService],
  templateUrl: './upload.component.html',
})
export class UploadPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private blockChainService = inject(BlockChainService);
  private fileRecordService = inject(FileRecordService);
  private notificationService = inject(NotificationService);

  constructor() {
    effect(() => {
      if (this.mode() === 'unknown') {
        this.router.navigate(['/']);
      }
    });
  }

  queryParams = toSignal(this.route.queryParams, {
    initialValue: { mode: undefined },
  });

  readonly mode = computed(() => {
    const param = this.queryParams()['mode'];
    if (param === undefined) return 'public';
    return param === 'private' ? param : 'unknown';
  });

  readonly isPublicMode = computed(() => this.mode() === 'public');
  readonly isPrivateMode = computed(() => this.mode() === 'private');

  file = signal<File | undefined>(undefined);
  readonly isFileSelected = computed(() => this.file() instanceof File);

  handleFileSelected(file: File) {
    this.file.set(file);
  }

  async handleEnrollFile() {
    if (!this.file()) return;
    const fileRecord = await this.fileRecordService.getFileRecord(this.file() as File);

    this.blockChainService.enroll(fileRecord).subscribe({
      next: (response) => {
        this.notificationService.success(`Block #${response.totalBlocks} Added To The BlockChain.`);
      },
      error: (error) => {
        this.notificationService.danger((error as Error).message);
      },
    });
  }

  async handleVerifyFile() {
    if (!this.file()) return;
    const fileRecord = await this.fileRecordService.getFileRecord(this.file() as File);

    this.blockChainService.verify(fileRecord).subscribe({
      next: (response) => {
        if (response.isChainValid) {
          this.notificationService.success(`Block #${response.blockIndex} Found!`);
        } else {
          this.notificationService.warning(`Block #${response.blockIndex} Found, (But BlockChain Is Unsafe)`);
        }
      },
      error: (error) => {
        this.notificationService.danger((error as Error).message);
      },
    });
  }

  notifyInvalidFile(message: string) {
    this.notificationService.danger(message);
  }
}
