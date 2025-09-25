export interface RevisionMetadata {
  delegate: any;
  revisionNumber: number;
  revisionDate: string;
  revisionInstant: string;
  revisionType: 'UPDATE' | 'INSERT' | 'DELETE' | 'UNKNOWN' ;
  requiredRevisionNumber: number;
  requiredRevisionInstant: string;
  changedFields: string[];
}

export interface RevisionEntry<T> {
  metadata: RevisionMetadata;
  entity: T;
}

export interface RevisionResponse<T> {
  content: RevisionEntry<T>[];
  empty: boolean;
  latestRevision: RevisionEntry<T>;
}
