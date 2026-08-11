export interface RequestPermission {
  name: string;
  scope: string | null;
}

export interface RequestUser {
  id: number;
  username: string;
  email: string;
  role_id: number;
  roleName: string;
  dept_id: number | null;
  permissions: RequestPermission[];
}
