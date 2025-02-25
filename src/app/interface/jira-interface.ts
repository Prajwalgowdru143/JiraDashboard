export interface JiraWorklog {
    author: {
      accountId: string
      displayName: string
      emailAddress: string
    }
    timeSpentSeconds: number
    started: string
    issueId: string
  }
  
  export interface ContributorStats {
    accountId: string
    displayName: string
    email: string
    totalTimeSpent: number
    issuesWorkedOn: Set<string>
    averageTimePerIssue: number
  }
  
  export interface DepartmentMetrics {
    totalContributions: number
    averagePerDeveloper: number
    totalIssues: number
    contributors: ContributorStats[]
  }
  
  export interface JiraSearchResponse {
    issues: {
      id: string
      key: string
      fields: {
        worklog: {
          worklogs: JiraWorklog[]
        }
      }
    }[]
    total: number
  }
  
  