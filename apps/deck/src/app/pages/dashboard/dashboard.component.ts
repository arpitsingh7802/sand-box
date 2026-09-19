import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppManifest } from '@sand-box/types';
import { HeaderComponent } from '@sand-box/ui';
import { ALL_APPS } from '@sand-box/util';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    FormsModule,
    InputTextModule,
    SelectButtonModule,
    CardModule,
    TagModule,
    ButtonModule,
    HeaderComponent,
  ],
})
export class DashboardComponent {
  apps = signal<AppManifest[]>(ALL_APPS);
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');

  categoryOptions = [
    { label: 'All', value: 'all' },
    { label: 'Utility', value: 'utility' },
    { label: 'Tool', value: 'tool' },
    { label: 'Playground', value: 'playground' },
    { label: 'Experimental', value: 'experimental' },
  ];

  filteredApps = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.selectedCategory();

    return this.apps().filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(query) ||
        app.tagline.toLowerCase().includes(query) ||
        app.tags.some((t) => t.toLowerCase().includes(query));

      const matchesCategory = cat === 'all' || app.category === cat;
      return matchesSearch && matchesCategory;
    });
  });
  getSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'stable':
        return 'success';
      case 'beta':
        return 'warn';
      case 'wip':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
