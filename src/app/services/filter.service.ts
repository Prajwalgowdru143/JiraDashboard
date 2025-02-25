import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private projectKeySource = new BehaviorSubject<string>('');
  private contributors = new BehaviorSubject<object>({})  // Default empty
  projectKey$ = this.projectKeySource.asObservable();
  contributors$ = this.contributors.asObservable();
  
updateContributors(contributors: object) {
    this.contributors.next(contributors);
  }

  updateProjectKey(projectKey: string) {
    this.projectKeySource.next(projectKey);
  }
}
