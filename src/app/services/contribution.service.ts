import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {
  // Mock API (Replace this with a real API when needed)
  private apiUrl = 'https://dashboard-jira.atlassian.net/rest/api/3';
  private token = 'ATATT3xFfGF0T6dqmVbW-68blGD_nRpxPNMGlAZ6E2asW7Tp5D_1JmUfuMxnz8a4BsZe97uOEjcxsc1dxod_kYYl0jvC2b_YafLntJPkcPOU-Y-F0iTDcRmnu4X4Eji-_gkZQfLwIMrn-yH79kTSQFg6Y-uXch-l0i0E4uJeAaHClF6MbZQT924=0A91E7F8';
  private headers = new HttpHeaders({
    'Authorization': 'Basic ' + btoa(`pajju2pg@gmail.com:${this.token}`),
    'Accept': 'application/json'
  });
  constructor(private http: HttpClient) { }


  //  Get the Filtered data
  async getFilterData(projectKey: string, startDate: string, endDate: string) {
    const jql = `project = "${projectKey}" AND created >= "${startDate}" AND created <= "${endDate}"`;

    try {
      const response = await this.http.get<any>(
        `/rest/api/3/search?jql=${encodeURIComponent(jql)}`,
        { headers: this.headers }
      ).toPromise();

      const userresponse = await this.http.get<any>(
        `/rest/api/3/user/assignable/search?project=${projectKey}`,
        { headers: this.headers }
      ).toPromise();

      return { response, userresponse };
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      return null;
    }
  }


  async getProjectIsuues(projectKey: string) {
    try {

      const totalIssuesResponse: any = await this.http.get<any>(
        `/rest/api/3/search?jql=project=${projectKey}&maxResults=0`,
        { headers: this.headers }
      ).toPromise();

      const totalIssuesDoneResponse: any = await this.http.get<any>(
        `/rest/api/3/search?jql=project=${projectKey} AND statusCategory=Done`,
        { headers: this.headers }
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
              { headers: this.headers }
            ).toPromise();
    
            // Fetch total issues done
            const totalIssuesDoneResponse: any = await this.http.get<any>(
              `/rest/api/3/search?jql=project=${projectKey} AND assignee=${userKey} AND statusCategory=Done`,
              { headers: this.headers }
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

  getProjectUsers(projectKey: string): Observable<any[]> {
    return this.http.get<any[]>(`/rest/api/3/user/assignable/search?project=${projectKey}`, { headers: this.headers }).pipe(
      // tap(data => console.log('Fetched users:', data)),
      catchError(error => {
        console.error('Error fetching department stats:', error);
        return of([]);
      })
    );
  }

  // get the projects
  getDepartmentStats(): Observable<any[]> {
    return this.http.get<any[]>('/rest/api/3/project', { headers: this.headers }).pipe(
      // tap(data => console.log('Fetched department stats:', data)),
      catchError(error => {
        console.error('Error fetching department stats:', error);
        return of([]);
      })
    );
  }

  getDepartment(projectKey: string): Observable<any> {
    return this.http.get<any>(`/rest/api/3/project/${projectKey}`, { headers: this.headers }).pipe(
      // tap(data => console.log('Fetched department:', data)), 
      catchError(error => {
        console.error('Error fetching department:', error);
        return of(null); // Return null instead of an empty array
      })
    );
  }
  


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
