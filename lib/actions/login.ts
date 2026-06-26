'use server'

export async function LoginUser(formdata:FormData) {
    console.log(formdata.get('email'));

}