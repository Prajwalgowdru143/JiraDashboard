import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FilterService } from './filter.service';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {
 

  constructor(private filterService: FilterService, private http: HttpClient) {
  
  }

  // Generate headers dynamically to ensure the latest user details are used
  private getHeaders(): HttpHeaders {
    
  let userDetails: any;
  this.filterService.userDetails$.subscribe(details => {
    userDetails = details;
  });

  if (!userDetails?.email || !userDetails?.apiToken) {
    console.error("❌ User details are missing!");
    return new HttpHeaders(); // Return empty headers to prevent errors
  }

  return new HttpHeaders({
    'Authorization': 'Basic ' + btoa(`${userDetails.email}:${userDetails.apiToken}`),
    'Accept': 'application/json'
  });
  }
  

  // Get filtered data
  async getFilterData(projectKey: string, startDate: string, endDate: string) {
    const jql = `project = "${projectKey}" AND created >= "${startDate}" AND created <= "${endDate}"`;

    try {
      const response = await this.http.get<any>(
        `/rest/api/3/search?jql=${encodeURIComponent(jql)}`,
        { headers: this.getHeaders() } // ✅ Use updated headers
      ).toPromise();

      const userresponse = await this.http.get<any>(
        `/rest/api/3/user/assignable/search?project=${projectKey}`,
        { headers: this.getHeaders() } // ✅ Use updated headers
      ).toPromise();

      return { response, userresponse };
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      return null;
    }
  }

  // Get total issues and completed issues for a project
  async getProjectIsuues(projectKey: string) {
    try {

      const totalIssuesResponse: any = await this.http.get<any>(
        `/rest/api/3/search?jql=project=${projectKey}&maxResults=0`,
        { headers: this.getHeaders() }
      ).toPromise();

      const totalIssuesDoneResponse: any = await this.http.get<any>(
        `/rest/api/3/search?jql=project=${projectKey} AND statusCategory=Done`,
        { headers: this.getHeaders() }
      ).toPromise();

      return {totalIssuesDoneResponse, totalIssuesResponse};
    }
    catch (error) {
      console.error('Error fetching filtered data:', error);
      return null;
    }
  }

  // get the totoal issues by the user
  // user/assignable/search?project=10000
  // search?jql=assignee=user AND project=10000&maxResults=0
  // search?jql=project=PROJECT_KEY AND assignee=user AND statusCategory=Done
  async getContributions(projectKey: string) {
    
      try {
        // Step 1: Fetch assignable users
      const users: any[] = (await this.getProjectUsers(projectKey).toPromise()) || [];
      const department: any = await this.getDepartment(projectKey).toPromise(); // Expect a single object now

      // console.log("Department Data:", department);
  
      const departmentName = department?.name || 'Unknown'; 

    
        // Step 2: Fetch issue data for each user
        const contributions = await Promise.all(
          users.map(async (user) => {
            const userKey = user.accountId; // Adjust key based on API response
    
            // Fetch total issues assigned
            const totalIssuesResponse: any = await this.http.get<any>(
              `/rest/api/3/search?jql=assignee=${userKey} AND project=${projectKey}&maxResults=0`,
              { headers: this.getHeaders() }
            ).toPromise();
    
            // Fetch total issues done
            const totalIssuesDoneResponse: any = await this.http.get<any>(
              `/rest/api/3/search?jql=project=${projectKey} AND assignee=${userKey} AND statusCategory=Done`,
              { headers: this.getHeaders() }
            ).toPromise();
    
            return {
              department: departmentName, // Adjust key based on API response
              user: user.displayName, // Adjust key based on API response
              avatar: user.avatarUrls['48x48'], // Adjust key based on API response
              totalIssues: totalIssuesResponse?.total || 0,
              totalIssuesDone: totalIssuesDoneResponse?.total || 0,
            };
          })
        );
    
        // console.log("Contributions Data:", contributions);
        return contributions;
      } catch (error) {
        console.error("Error fetching contributions:", error);
        return [];
      }
    }


  // Get assignable users for a project
  getProjectUsers(projectKey: string): Observable<any[]> {
    return this.http.get<any[]>(`/rest/api/3/user/assignable/search?project=${projectKey}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching project users:', error);
        return of([]);
      })
    );
  }

  // Get department stats (projects list)
  getDepartmentStats(): Observable<any[]> {
    return this.http.get<any[]>('/rest/api/3/project', { headers: this.getHeaders() }).pipe(
      tap(data => console.log('Fetched department stats:', data)),
      catchError(error => {
        console.error('Error fetching department stats:', error);
        return of([]);
      })
    );
  }

  // Get a single department (project) details
  getDepartment(projectKey: string): Observable<any> {
    return this.http.get<any>(`/rest/api/3/project/${projectKey}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching department:', error);
        return of(null);
      })
    );
  }

  // Generic error handler
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
