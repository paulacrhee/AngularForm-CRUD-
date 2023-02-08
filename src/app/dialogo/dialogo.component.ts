import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css'],
})
export class DialogoComponent implements OnInit {
  formulario!: FormGroup;
  actionBtn: string = 'Guardar';
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogoComponent>
  ) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z áéíóúÁÉÍÓÚñÑs]*$'),
      ]),
      apellidos: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z áéíóúÁÉÍÓÚñÑs]*$'),
      ]),

      dni: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{8,8}[A-Za-z]$'),
      ]),
      telefono: new FormControl('', [Validators.required]),
      sexo: new FormControl('', [Validators.required]),
    });
    if (this.editData) {
      this.actionBtn = 'Actualizar';

      this.formulario.controls['nombre'].setValue(this.editData.nombre);
      this.formulario.controls['apellidos'].setValue(this.editData.apellidos);

      this.formulario.controls['dni'].setValue(this.editData.dni);
      this.formulario.controls['telefono'].setValue(this.editData.telefono);
      this.formulario.controls['sexo'].setValue(this.editData.sexo);
    }
  }
  public myError = (controlName: string, errorName: string) => {
    return this.formulario.controls[controlName].hasError(errorName);
  };
  anadirSocio() {
    if (!this.editData) {
      if (this.formulario.valid) {
        this.api.postPersona(this.formulario.value).subscribe({
          next: (res) => {
            alert('Socio añadido a la lista correctamente');
            this.formulario.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert('Ha ocurrido un error');
          },
        });
      }
    } else {
      this.actualizarSocio();
    }
  }
  actualizarSocio() {
    this.api.putPersona(this.formulario.value, this.editData.id).subscribe({
      next: (res) => {
        this.formulario.reset();

        this.dialogRef.close('update');
        alert('Datos modificados correctamente');
      },
      error: () => {
        alert('Ha ocurrido un error al actualizar datos');
      },
    });
  }
}
