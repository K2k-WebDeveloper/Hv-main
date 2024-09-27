export interface ApiResponse {
    status:boolean;
    message:string;
    data:any;
}
// Paginated Response
export interface PaginatedApiResponse {
    status:boolean;
    message:string;
    data:{
        total:number;
        pagination:number;
        page:number;
        pages:number;
        filtered:number;
        data:Array<any>;
    };
}
// Paginated Response
