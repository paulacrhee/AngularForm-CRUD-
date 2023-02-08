import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogoComponent } from './dialogo/dialogo.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Socio';
  displayedColumns: string[] = [
    'socio',
    'nombre',
    'apellidos',
    'dni',
    'telefono',
    'sexo',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialogo: MatDialog, private api: ApiService) {}
  ngOnInit(): void {
    this.getAllSocios();
  }

  openDialog() {
    this.dialogo
      .open(DialogoComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllSocios();
        }
      });
  }
  getAllSocios() {
    this.api.getSocio().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error al recuperar registro');
      },
    });
  }
  editarSocio(row: any) {
    this.dialogo
      .open(DialogoComponent, {
        width: '30%',
        data: row,
      })

      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllSocios();
        }
      });
  }
  eliminarPersona(id: number) {
    this.api.eliminarPersona(id).subscribe({
      next: (res) => {
        alert('¿Desea eliminar este socio de la lista?');
        this.getAllSocios();
      },
      error: () => {
        alert('Error al eliminar socio de la lista');
      },
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
