import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = false;

  setLoading(value: boolean) {
    this.loading = value;
  }

  isLoading() {
    return this.loading;
  }
}