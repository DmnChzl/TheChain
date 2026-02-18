import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@shared/components/button';
import { DiamondIconComponent } from '@shared/components/icons';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MainLayoutComponent } from '@shared/layouts/main';
import { ModalService } from '@shared/services/modal.service';
import { HeroComponent } from './components/hero';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MainLayoutComponent, ButtonComponent, DiamondIconComponent, HeroComponent, ModalComponent],
  templateUrl: './home.component.html',
})
export class HomePageComponent implements OnInit {
  modalService = inject(ModalService);

  constructor(private router: Router) {}

  ngOnInit() {
    // eslint-disable-next-line no-console
    console.log('The BlockChain Project');
  }

  goToPublicUpload() {
    this.router.navigate(['/upload']);
  }

  openModalWithConfig() {
    this.modalService.open({
      title: 'Use Private Chain',
      description: 'Do you wanna use the application in private mode/in a secure way?',
    });
  }

  goToPrivateUpload() {
    this.modalService.close();
    this.router.navigate(['/upload'], {
      queryParams: { mode: 'private' },
    });
  }
}
