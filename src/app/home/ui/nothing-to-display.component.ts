import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-ntd',
  template: `
    <div class="h-full w-full flex justify-center items-center">
      <span class="text-lg text-gray-400">Nothing to display...</span>
    </div>
  `,
  host: {
    class: 'h-full',
  },
})
export default class NothingToDisplayComponent {}
