import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserService } from '../../servicios/user.service';
import { AuthService } from '../../servicios/auth.service';

 @Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  imports: [

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    FlexLayoutModule

  ],
  providers:[ToastrService, UserService]

})
export class RegistroComponent {
  registroForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router:Router
  ) {
    this.registroForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(){

      let param:any = {
        usuario: this.registroForm.value.username,
        contrasenia: this.registroForm.value.password,

      }
      this.userService.registrar(param).subscribe((result:any) => {
        if (result.code === 1) {
          this.toastr.success("Registro Existoso");
          setTimeout(() => {
            this.router.navigate(['/login']);

          }, 2000);
        }
      }, (err:any) => {
        console.error(err);
      });
    }
  }

