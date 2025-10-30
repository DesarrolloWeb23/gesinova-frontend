import * as React from 'react'
import { UserApiService } from "@/core/infrastructure/api/services/userService";
import { toast } from "sonner";
import { getMessage } from "@/core/domain/messages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/ui/components/ui/form"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/ui/components/ui/button"
import { ChangePassword } from "@/core/domain/use-cases/ChangePassword";
import { Input } from './ui/input';

const FormSchema = z.object({
    oldPassword: z.string().min(4, getMessage("errors", "zod_password_required")),
    confirmPassword: z.string().min(4, getMessage("errors", "zod_password_required")),
    newPassword: z.string().min(4, getMessage("errors", "zod_password_required")),
    admin_profile: z.boolean().optional(),
}) 

function ChangePasswordCard() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            oldPassword: "",
            confirmPassword: "",
            newPassword: "",
        },
    })

    function changePassword(data: z.infer<typeof FormSchema>) {
        const changePasswordUseCase = new ChangePassword(new UserApiService());
        try {
            toast.promise(
                changePasswordUseCase.execute(data.oldPassword, data.confirmPassword, data.newPassword)
                .then(() => {
                    localStorage.setItem("isFirstLogin", "false");
                    window.location.reload();
                })
                .catch((error) => {
                    throw error;
                }),                
                {
                    loading: getMessage("success", "sending"),
                    success: getMessage("success", "password_change_success"),
                    error: (error) => 
                        error?.message
                }
            );
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    }

    return (
        <Card className="bg-primary rounded-2xl shadow-lg border border-gray-100">
            <CardHeader>
                <CardTitle>Cambio de Contraseña</CardTitle>
            <CardDescription>
                Cambia tu contraseña actual por una nueva.
            </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(changePassword)} className="w-full space-y-6">

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="oldPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Antigua Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Confirmar Antigua Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Nueva Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex items-center justify-end">
                            <Button type="submit">Cambiar contraseña</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ChangePasswordCard;