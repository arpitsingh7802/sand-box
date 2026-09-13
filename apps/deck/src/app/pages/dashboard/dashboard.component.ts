import { TitleCasePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { AppCategory, AppManifest } from '@sand-box/types';
import { ALL_APPS } from '@sand-box/util';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <!-- Header / Banner -->
      <header class="hero">
        <div class="badge">SANDBOX CONTROL CENTER</div>
        <h1>Pick a Tool. Start Experimenting.</h1>
        <p>A playground for modern web utilities, canvas experiments, and Angular concepts.</p>

        <!-- Search & Filter Controls -->
        <div class="controls">
          <input
            type="text"
            placeholder="Search tools or tags (e.g. 'canvas', 'JSON')..."
            [value]="searchQuery()"
            (input)="updateSearch($event)"
            class="search-input"
          />

          <div class="category-pills">
            <button
              [class.active]="selectedCategory() === 'all'"
              (click)="selectedCategory.set('all')"
            >
              All Tools ({{ apps().length }})
            </button>
            @for (cat of categories; track cat) {
              <button
                [class.active]="selectedCategory() === cat"
                (click)="selectedCategory.set(cat)"
              >
                {{ cat | titlecase }}
              </button>
            }
          </div>
        </div>
      </header>

      <!-- Grid of Cards -->
      <div class="app-grid">
        @for (app of filteredApps(); track app.id) {
          <a [href]="app.path" class="app-card" [style.--accent]="app.accentColor">
            <div class="card-header">
              <span class="app-icon">{{ app.icon }}</span>
              <span class="status-pill {{ app.status }}">{{ app.status }}</span>
            </div>

            <div class="card-body">
              <h3>{{ app.name }}</h3>
              <p>{{ app.tagline }}</p>
            </div>

            <div class="card-footer">
              <div class="tags">
                @for (tag of app.tags; track tag) {
                  <span class="tag">#{{ tag }}</span>
                }
              </div>
              <span class="launch-btn">Launch ↗</span>
            </div>
          </a>
        } @empty {
          <div class="empty-state">
            <p>🔍 No tools match your filter request.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
        color: #f8fafc;
      }
      .hero {
        text-align: center;
        margin-bottom: 3rem;
      }
      .hero h1 {
        font-size: 2.5rem;
        font-weight: 800;
        margin: 0.5rem 0;
        color: #f8fafc;
      }
      .hero p {
        color: #94a3b8;
        font-size: 1.1rem;
      }
      .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: rgba(56, 189, 248, 0.1);
        color: #38bdf8;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
        border: 1px solid rgba(56, 189, 248, 0.3);
      }

      .controls {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
      .search-input {
        width: 100%;
        max-width: 500px;
        padding: 0.8rem 1.2rem;
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 12px;
        color: white;
        font-size: 1rem;
      }
      .search-input:focus {
        outline: none;
        border-color: #38bdf8;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
      }

      .category-pills {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
      }
      .category-pills button {
        background: #1e293b;
        border: 1px solid #334155;
        color: #94a3b8;
        padding: 0.4rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .category-pills button.active,
      .category-pills button:hover {
        background: #38bdf8;
        color: #0f172a;
        font-weight: 600;
        border-color: #38bdf8;
      }

      .app-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      .app-card {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 16px;
        padding: 1.5rem;
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }
      .app-card:hover {
        transform: translateY(-4px);
        border-color: var(--accent, #38bdf8);
        box-shadow:
          0 10px 25px -5px rgba(0, 0, 0, 0.3),
          0 0 15px -3px var(--accent);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .app-icon {
        font-size: 2.2rem;
      }
      .status-pill {
        font-size: 0.7rem;
        padding: 0.2rem 0.6rem;
        border-radius: 6px;
        text-transform: uppercase;
        font-weight: bold;
      }
      .status-pill.stable {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
      }
      .status-pill.beta {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
      }
      .status-pill.wip {
        background: rgba(236, 72, 153, 0.2);
        color: #ec4899;
      }

      .card-body h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.3rem;
        color: #f8fafc;
      }
      .card-body p {
        margin: 0;
        color: #94a3b8;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .card-footer {
        margin-top: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .tags {
        display: flex;
        gap: 0.4rem;
      }
      .tag {
        font-size: 0.75rem;
        color: #64748b;
      }
      .launch-btn {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--accent, #38bdf8);
      }

      .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem;
        color: #64748b;
      }
    `,
  ],
  imports: [TitleCasePipe],
})
export class DashboardComponent {
  apps = signal<AppManifest[]>(ALL_APPS);
  searchQuery = signal<string>('');
  selectedCategory = signal<AppCategory | 'all'>('all');

  categories: AppCategory[] = ['utility', 'tool', 'playground', 'experimental'];

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

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
