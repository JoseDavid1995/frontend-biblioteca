import { CommonModule } from "@angular/common";
import { LoadingService } from "../loading.service";
import { Component } from "@angular/core";

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.isLoading()" class="loading-overlay">
      <div class="spinner">
        <div class="spinner-border"></div>
      </div>
      <p class="loading-text">
        <span *ngFor="let letter of loadingText.split(''); let i = index" 
              [ngStyle]="{'animation-delay': (i * 0.1) + 's'}" 
              class="loading-letter">
          {{ letter }}
        </span>
      </p>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      z-index: 1000;
    }
    .spinner {
      position: relative;
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: spin 1.5s linear infinite;
    }
    .spinner-border {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 8px solid transparent;
      border-top-color: #3498db;
      animation: border-spin 1s linear infinite, pulse 1s ease-in-out infinite; /* Cambiar a 1s para rotación */
      box-shadow: 0 0 20px rgba(52, 152, 219, 0.8);
    }
    .loading-text {
      margin-top: 15px;
      font-size: 1.4em;
      color: #333;
      font-weight: bold;
      text-align: center;
      text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.8);
      font-family: 'Press Start 2P', cursive; /* Fuente de estilo retro */
    }
    .loading-letter {
      display: inline-block;
      opacity: 0; /* Inicialmente invisible */
      animation: fade-in 0.5s forwards, blink 1s step-end infinite;
    }
    @keyframes fade-in {
      to { opacity: 1; }
    }
    @keyframes blink {
      50% { opacity: 0; }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes border-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(52, 152, 219, 0.8); }
      50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(52, 152, 219, 1); }
    }
  `]
})
export class LoadingSpinnerComponent {
  loadingText = "Cargando...";

  constructor(public loadingService: LoadingService) {}
}