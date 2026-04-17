import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import { loginApi } from "@/services/auth";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { authCookie } from "@/lib/cookie";

export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginApi(form);

      const token = res.data.token;
      const user = res.data.user;

      authCookie.setToken(token);
      setAuth(user, token);

      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Login gagal");
      } else {
        alert("Login gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your username below to login to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                {/* Username */}
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </Field>

                {/* Password */}
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </Field>

                {/* Submit */}
                <Field>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Login"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
