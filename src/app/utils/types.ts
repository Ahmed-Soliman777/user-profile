export interface JWTPayload {
  id: number;
  Email: string;
}

export interface RouteProps {
  params: { id: string };
}
