import { Component, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import Chart from 'chart.js/auto';

import { UserService } from '../../services/user.service';
import { PublicacionService } from '../../services/publicacion.service';
import { RecursoService } from '../../services/recurso.service';
import { NotificacionService } from '../../services/notificacion.service';
import { ComentarioService } from '../../services/comentario.service';
import { RolService } from '../../services/rol.service';
import { ForoService } from '../../services/foro.service';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent {
  // Inyecciones
  private userService = inject(UserService);
  private publicacionService = inject(PublicacionService);
  private recursoService = inject(RecursoService);
  private notiService = inject(NotificacionService);
  private comentarioService = inject(ComentarioService);
  private rolService = inject(RolService);
  private foroService = inject(ForoService);
  private catService = inject(CategoriaService);
  private cd = inject(ChangeDetectorRef);

  // Variables
  filtro: string = '';
  resultados: any[] = [];
  columnas: string[] = [];
  
  mostrarGrafico: boolean = false; 
  tipoResultado: string = 'tabla';

  // Modal
  modalVisible = false;
  modalAction = '';
  modalTitle = '';
  inputValue = ''; 

  // Listas
  listaRoles: any[] = [];
  listaUsuarios: any[] = [];
  listaForos: any[] = [];
  listaCategorias: any[] = [];
  listaPublicaciones: any[] = [];

  @ViewChild('resultadosRef') resultadosRef!: ElementRef;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chart: any;

  get resultadosFiltrados() {
    if (!this.filtro || this.filtro.trim() === '') return this.resultados;
    const termino = this.filtro.toLowerCase();
    return this.resultados.filter(item => 
      JSON.stringify(item).toLowerCase().includes(termino)
    );
  }

  limpiarVista() {
    this.resultados = [];
    this.columnas = [];
    this.mostrarGrafico = false;
    this.tipoResultado = 'tabla';
    this.filtro = '';
    this.destroyChart();
  }

  cerrarGrafico() {
    this.mostrarGrafico = false;
    this.destroyChart();
  }

  scrollToResults() {
    this.cd.detectChanges();
    setTimeout(() => {
      if (this.resultadosRef && this.resultadosRef.nativeElement) {
        this.resultadosRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  // =========================================================
  //   GRÁFICOS
  // =========================================================

  graficoUsuariosPorRol() {
    this.limpiarVista();
    this.userService.listar().subscribe(lista => this.prepareTable(lista));
    
    this.userService.getEstadisticasRoles().subscribe((stats: any) => {
       this.renderChartFromStats(stats, 'pie', 'Distribución de Roles');
    });
  }

  graficoPublicacionesPorForo() {
    this.limpiarVista();
    this.publicacionService.listar().subscribe(lista => this.prepareTable(lista));
    
    this.publicacionService.getEstadisticasForos().subscribe((stats: any) => {
       this.renderChartFromStats(stats, 'bar', 'Popularidad de Foros');
    });
  }

  graficoRecursosPorCategoria() {
    this.limpiarVista();
    // Usamos .listar() que ahora sí existe en RecursoService
    this.recursoService.listar().subscribe(lista => this.prepareTable(lista));
    
    // CORREGIDO: Llamamos a Categorias, no Foros
    this.recursoService.getEstadisticasCategorias().subscribe((stats: any) => {
       this.renderChartFromStats(stats, 'doughnut', 'Recursos por Categoría');
    });
  }

  graficoTopUsuarios() {
    this.limpiarVista();
    this.publicacionService.listar().subscribe(lista => this.prepareTable(lista));
    
    this.publicacionService.getTopUsuarios().subscribe((stats: any) => {
       const top5 = stats.slice(0, 5);
       this.renderChartFromStats(top5, 'bar', 'Top 5 Usuarios Más Activos', 'y');
    });
  }

  renderChartFromStats(stats: any[], type: any, title: string, indexAxis: string = 'x') {
    if (!stats || stats.length === 0) return;

    this.mostrarGrafico = true;
    this.tipoResultado = 'grafico';
    this.cd.detectChanges();
    
    const labels = stats.map(s => s.label || s[0]);
    const values = stats.map(s => s.cantidad || s.valor || s[1]);

    this.renderChart(type, labels, values, title, indexAxis);
  }

  // =========================================================
  //   OTRAS CONSULTAS
  // =========================================================
  usuariosConFavoritos() {
    this.limpiarVista();
    this.userService.getUsuariosConFavoritos().subscribe(r => this.prepareTable(r));
  }

  usuariosQueSiguenForos() {
    this.limpiarVista();
    this.userService.getUsuariosQueSiguenForos().subscribe(r => this.prepareTable(r));
  }

  // --- MODAL LOGIC (Corregido para cargar listas) ---
  openModal(action: string, title: string) {
    this.modalAction = action;
    this.modalTitle = title;
    this.inputValue = '';
    
    // Aquí es donde decimos: "Si abres este modal, carga ESTA lista del backend"
    switch (action) {
      
      // 1. Si el modal pide USUARIOS
      case 'publicacionesPorUsuario': // <--- Faltaba este
      case 'notificacionesPorUsuario':
      case 'noLeidas':
        this.userService.listar().subscribe(data => {
            this.listaUsuarios = data;
            console.log("Usuarios cargados:", data); // Para depurar en consola (F12)
        });
        break;

      // 2. Si el modal pide ROLES (Por si usas el botón antiguo)
      case 'usuariosPorRol':
        this.rolService.listar().subscribe(data => this.listaRoles = data);
        break;

      // 3. Si el modal pide FOROS
      case 'publicacionesPorForo':
         this.foroService.listarTodos().subscribe(data => this.listaForos = data);
         break;

      // 4. Si el modal pide CATEGORIAS
      case 'recursosPorCategoria':
         this.catService.listar().subscribe(data => this.listaCategorias = data);
         break;

      // 5. Si el modal pide PUBLICACIONES
      case 'comentariosPorPublicacion':
        this.publicacionService.listar().subscribe(data => this.listaPublicaciones = data);
        break;
    }
    
    this.modalVisible = true;
  }
  closeModal() { this.modalVisible = false; }

  execute() {
    if (!this.inputValue && this.modalAction !== 'publicacionesPorPalabra') { 
        alert("Seleccione o ingrese un valor"); return; 
    }
    this.limpiarVista();
    const val = this.inputValue;
    const valNum = Number(this.inputValue);

    switch (this.modalAction) {
      case 'publicacionesPorPalabra':
        this.publicacionService.buscarPublicacionesPorPalabra(val).subscribe(d => this.prepareTable(d));
        break;
      case 'notificacionesPorUsuario':
        this.notiService.getNotificacionesPorUsuario(valNum).subscribe(d => this.prepareTable(d));
        break;
      case 'comentariosPorPublicacion':
        this.comentarioService.getComentariosPorPublicacion(valNum).subscribe(d => this.prepareTable(d));
        break;
      case 'noLeidas':
        this.userService.obtenerPorId(valNum).subscribe({
          next: (usuario) => {
             this.notiService.getNotificacionesNoLeidas(valNum).subscribe(n => {
              const dataTabla = [{ "Usuario": usuario.username, "Notificaciones Sin Leer": n }];
              this.prepareTable(dataTabla);
            });
          },
          error: () => alert("Usuario no encontrado")
        });
        break;
    }
    this.closeModal();
  }

  prepareTable(data: any[]) {
    if (!data || data.length === 0) {
      this.resultados = [];
      if (!this.mostrarGrafico) alert('No se encontraron resultados.');
      return;
    }
    
    const colOcultas = ['password', 'contrasena', 'id', 'usuarioid', 'foroid', 'categoriaid', 'publicacionid'];
    
    const dataLimpia = data.map(item => {
      const newItem: any = {};
      Object.keys(item).forEach(key => {
        if (!colOcultas.includes(key.toLowerCase())) {
          if (typeof item[key] === 'object' && item[key] !== null) {
             newItem[key] = item[key].nombre || item[key].titulo || JSON.stringify(item[key]);
          } else {
             newItem[key] = item[key];
          }
        }
      });
      return newItem;
    });

    this.resultados = dataLimpia;
    this.columnas = Object.keys(dataLimpia[0]);
    this.scrollToResults();
  }

  renderChart(type: any, labels: any[], data: any[], title: string, indexAxis: string = 'x') {
    this.destroyChart();
    setTimeout(() => {
      if (!this.chartCanvas) return;
      
      this.chartCanvas.nativeElement.scrollIntoView({ behavior: 'smooth' });

      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: type,
        data: {
          labels: labels,
          datasets: [{
            label: title,
            data: data,
            backgroundColor: ['#5aa9a4', '#2c5f5b', '#91d3cf', '#ffcf99', '#ff9f66', '#ff6b6b'],
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: indexAxis,
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: title, font: { size: 16 } }
          }
        }
      });
    }, 100);
  }

  destroyChart() {
    if (this.chart) { this.chart.destroy(); this.chart = null; }
  }
}