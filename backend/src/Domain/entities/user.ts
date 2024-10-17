export interface User{
    id?:string;
    name:string;
    email:string;
    mobile:string; 
    password:string;
    is_verified:boolean;
    is_blocked:boolean;
    wallet?:string;
    
}
export type GoogleLoginUser = Omit<User, 'password' | 'mobile'> & { uid: string };