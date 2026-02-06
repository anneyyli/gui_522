export const helloWorldConst: string = "Hello World! (const)";

export async function helloWorldFunction(): Promise<string> {
    console.log("hitting hello world api...");
    const res = await fetch("http://localhost:8080/apis/helloWorld");
    return res.text();
}