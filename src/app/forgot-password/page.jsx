"use client"

import { useState } from "react"
import Link from "next/link"
import {zodResolver} from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import {z} from 'zod'
import { Layers } from "lucide-react";
import {Button} from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {toast} from 'sonner'; 
import {useAuth} from "@/components/auth/auth-provider"

const formSchema=z.object({
    email:z.string().email({message:"Please enter a valid email"})
})


export default function ForgotPasswordPage(){
    
    const{resetPassword}=useAuth()
    const[isLoading,setIsLoading]=useState(false)
    const[isSubmitted,setIsSubmitted]=useState(false)
    const form=useForm({
        resolver:zodResolver(formSchema),
        defaultValues:{
            email:""
        }
    }) 
    const onSubmit=async(values)=>{
         setIsLoading(true);
    try {
        
        await resetPassword(values.email)

      setIsSubmitted(true);

      toast(
  <div>
    <strong>Reset link sent</strong>
    <div>Check your email for password reset instructions.</div>
  </div>
);


      
    } catch (error) {
      
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
    }

    return(
         <div className="container mx-auto flex flex-col justify-center space-y-6 sm:w-[350px] pt-16">
      <div className="flex flex-col space-y-2 text-center">
        <div className="mx-auto">
          <Layers className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      {!isSubmitted ? (
        <div className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            We've sent you an email with instructions to reset your password.
            Please check your inbox.
          </p>
          <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
            Try another email
          </Button>
        </div>
      )}

      <p className="px-8 text-sm text-center text-muted-foreground">
        Remember your password?{' '}
        <Link
          href="/login"
          className="underline hover:text-brand underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
    )

}