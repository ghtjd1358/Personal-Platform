export interface DownloadResumeCommand {
  fileName?: string;
  downloadAs?: string;
}

export interface GetResumeUrlCommand {
  fileName?: string;
}
