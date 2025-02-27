import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private projectKeySource = new BehaviorSubject<string>('');
  private contributors = new BehaviorSubject<object>({}) 
  private userDetails = new BehaviorSubject<object>({})
  private departmentsSubject = new BehaviorSubject<{ id: string, name: string }[]>([]);

  projectKey$ = this.projectKeySource.asObservable();
  contributors$ = this.contributors.asObservable();
  userDetails$ = this.userDetails.asObservable();

  departments$ = this.departmentsSubject.asObservable();

  updateDepartments(departments: { id: string, name: string }[]) {
    console.log(" Updating departments in FilterService:", departments);
    if (departments.length > 0) {  //  Only update if non-empty
      this.departmentsSubject.next(departments);
    }
  }
  
updateContributors(contributors: object) {
    this.contributors.next(contributors);
  }

  updateUserDetails(userDetails: object) {
    this.userDetails.next(userDetails);
  }

  updateProjectKey(projectKey: string) {
    this.projectKeySource.next(projectKey);
  }
}
