import React from "react";
import { Button } from "@/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card"
import { Input } from "@/ui/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Version } from "@/ui/components/Version";
import { getMessage } from "@/core/domain/messages";
import { useView } from "@/ui/context/ViewContext";

const formSchema = z.object({
  username: z.string().min(2, getMessage("errors", "zod_username_required")),
  password: z.string().min(4, getMessage("errors", "zod_password_required"))
})

const keys = [
    ['1','2','3','4','5','6','7','8','9','0','-','='],
    ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
    ['a','s','d','f','g','h','j','k','l',';','\''],
    ['z','x','c','v','b','n','m',',','.','/']
];

export default function Screen() {
  
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const { login, validationToken } = useAuth();
  const { setView } = useView();
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
        password: "",
      }, 
    })
  
    const handleChangeView = (view: string) => {

      setTimeout(() => {
        setView(view) 
      }, 500)
    }
    
    // const [output, setOutput] = useState('');

    // const handleClick = (key: string) => {
    //     setOutput(prev => prev + (key === 'space' ? ' ' : key));
    // };
    

    
    return (
      <div id="container" className="h-dvh">
        {/* boton para volver */}
        <div className="flex justify-end p-4">
          <Button variant="ghost" onClick={() => handleChangeView("login")}>
            {getMessage("ui", "screen_back_to_login")}
          </Button>
        </div>
        <div className="flex flex-col items-center h-full">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                {getMessage("ui", "screen_title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getMessage("ui", "screen_password")}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={getMessage("ui", "screen_password_placeholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit"  className="w-full">
                    {getMessage("ui", "wait") }
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {getMessage("ui", "version")} <Version />
              </div>
              <Button variant="link" onClick={() => handleChangeView("resetPassword")}>
                {getMessage("ui", "forgot_password")}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gray-100 p-4 w-full flex flex-col items-center text-white">
            {keys.map((row, rowIndex) => (
              <div key={rowIndex} className="flex w-[740px] flex-wrap gap-1 justify-center mb-1">
              {row.map((key, keyIndex) => (
                  <button
                  key={keyIndex}
                  className="bg-white text-black rounded px-4 py-2 hover:bg-gray-300"
                  >
                  {key}
                  </button>
              ))}
              </div>
          ))}
          {/* <div className="flex gap-2 w-[740px] justify-between mt-2">
              <button className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded flex-1">Space</button>
          </div> */}
        </div>
      </div>
    );
  }