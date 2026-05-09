import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {userService} from "@/services/user.service";
import {CreateUserRequest, DeleteUserRequest} from "@/types/user";

export const USER_QUERY_KEY = 'users';

export const useUsers = () => {
    return useQuery({
        queryKey: [USER_QUERY_KEY],
        queryFn: () => userService.list(),
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUserRequest) => userService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
        }
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: DeleteUserRequest }) =>
            userService.delete(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
        }
    })
}