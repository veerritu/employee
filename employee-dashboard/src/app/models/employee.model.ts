export class Employee {
    id: number;
    name: string;
    email: string;
    phone: string;
    username: string;
    address: Address;
    website: string;
    company: Company;
}

export class Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

export class Geo {
    lat: string;
    lng: string;
}

export class Company {
    name: string;
    catchPhrase: string;
    bs: string;
}