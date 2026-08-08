import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Booking_Key {
  id: UUIDString;
  __typename?: 'Booking_Key';
}

export interface Conversation_Key {
  id: UUIDString;
  __typename?: 'Conversation_Key';
}

export interface CreateServiceCategoryData {
  serviceCategory_insert: ServiceCategory_Key;
}

export interface CreateServiceCategoryVariables {
  name: string;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  name: string;
  email?: string | null;
  role?: string | null;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  hourlyRate?: number | null;
}

export interface DeleteBookingData {
  booking_delete?: Booking_Key | null;
}

export interface DeleteBookingVariables {
  id: UUIDString;
}

export interface DeleteNotificationData {
  notification_delete?: Notification_Key | null;
}

export interface DeleteNotificationVariables {
  id: UUIDString;
}

export interface DeleteReviewData {
  review_delete?: Review_Key | null;
}

export interface DeleteReviewVariables {
  id: UUIDString;
}

export interface DeleteServiceCategoryData {
  serviceCategory_delete?: ServiceCategory_Key | null;
}

export interface DeleteServiceCategoryVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface DeleteUserVariables {
  id: UUIDString;
}

export interface GetBookingData {
  booking?: {
    id: UUIDString;
    status: string;
    startTime: TimestampString;
    endTime: TimestampString;
    totalDurationSeconds?: number | null;
    serviceLocation?: string | null;
    client: {
      id: UUIDString;
      name: string;
      email: string;
      phoneNumber: string;
    } & User_Key;
    provider: {
      id: UUIDString;
      name: string;
      email: string;
      phoneNumber: string;
      hourlyRate?: number | null;
    } & User_Key;
    category: {
      id: UUIDString;
      name: string;
    } & ServiceCategory_Key;
  } & Booking_Key;
}

export interface GetBookingVariables {
  id: UUIDString;
}

export interface GetUserData {
  user?: {
    id: UUIDString;
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
    profilePicture?: string | null;
    bio?: string | null;
    hourlyRate?: number | null;
  } & User_Key;
}

export interface GetUserVariables {
  id: UUIDString;
}

export interface ListBookingsData {
  bookings: ({
    id: UUIDString;
    status: string;
    startTime: TimestampString;
    endTime: TimestampString;
    totalDurationSeconds?: number | null;
    serviceLocation?: string | null;
    client: {
      id: UUIDString;
      name: string;
    } & User_Key;
    provider: {
      id: UUIDString;
      name: string;
      hourlyRate?: number | null;
    } & User_Key;
    category: {
      id: UUIDString;
      name: string;
    } & ServiceCategory_Key;
  } & Booking_Key)[];
}

export interface ListNotificationsData {
  notifications: ({
    id: UUIDString;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: TimestampString;
    recipient: {
      id: UUIDString;
      name: string;
    } & User_Key;
  } & Notification_Key)[];
}

export interface ListReviewsData {
  reviews: ({
    id: UUIDString;
    rating: number;
    comment?: string | null;
    createdAt: TimestampString;
    client: {
      id: UUIDString;
      name: string;
    } & User_Key;
    booking: {
      id: UUIDString;
      category: {
        name: string;
      };
      provider: {
        id: UUIDString;
        name: string;
      } & User_Key;
    } & Booking_Key;
  } & Review_Key)[];
}

export interface ListServiceCategoriesData {
  serviceCategories: ({
    id: UUIDString;
    name: string;
  } & ServiceCategory_Key)[];
}

export interface ListUsersData {
  users: ({
    id: UUIDString;
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
    profilePicture?: string | null;
    bio?: string | null;
    hourlyRate?: number | null;
  } & User_Key)[];
}

export interface MarkNotificationReadData {
  notification_update?: Notification_Key | null;
}

export interface MarkNotificationReadVariables {
  id: UUIDString;
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface Notification_Key {
  id: UUIDString;
  __typename?: 'Notification_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface ServiceCategory_Key {
  id: UUIDString;
  __typename?: 'ServiceCategory_Key';
}

export interface UpdateBookingStatusData {
  booking_update?: Booking_Key | null;
}

export interface UpdateBookingStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateServiceCategoryData {
  serviceCategory_update?: ServiceCategory_Key | null;
}

export interface UpdateServiceCategoryVariables {
  id: UUIDString;
  name: string;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserVariables {
  id: UUIDString;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  hourlyRate?: number | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface WorkSession_Key {
  id: UUIDString;
  __typename?: 'WorkSession_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;
export function deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface UpdateBookingStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBookingStatusVariables): MutationRef<UpdateBookingStatusData, UpdateBookingStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBookingStatusVariables): MutationRef<UpdateBookingStatusData, UpdateBookingStatusVariables>;
  operationName: string;
}
export const updateBookingStatusRef: UpdateBookingStatusRef;

export function updateBookingStatus(vars: UpdateBookingStatusVariables): MutationPromise<UpdateBookingStatusData, UpdateBookingStatusVariables>;
export function updateBookingStatus(dc: DataConnect, vars: UpdateBookingStatusVariables): MutationPromise<UpdateBookingStatusData, UpdateBookingStatusVariables>;

interface DeleteBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBookingVariables): MutationRef<DeleteBookingData, DeleteBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteBookingVariables): MutationRef<DeleteBookingData, DeleteBookingVariables>;
  operationName: string;
}
export const deleteBookingRef: DeleteBookingRef;

export function deleteBooking(vars: DeleteBookingVariables): MutationPromise<DeleteBookingData, DeleteBookingVariables>;
export function deleteBooking(dc: DataConnect, vars: DeleteBookingVariables): MutationPromise<DeleteBookingData, DeleteBookingVariables>;

interface DeleteReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  operationName: string;
}
export const deleteReviewRef: DeleteReviewRef;

export function deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;
export function deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface MarkNotificationReadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
  operationName: string;
}
export const markNotificationReadRef: MarkNotificationReadRef;

export function markNotificationRead(vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;
export function markNotificationRead(dc: DataConnect, vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

interface DeleteNotificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
  operationName: string;
}
export const deleteNotificationRef: DeleteNotificationRef;

export function deleteNotification(vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;
export function deleteNotification(dc: DataConnect, vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;

interface CreateServiceCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceCategoryVariables): MutationRef<CreateServiceCategoryData, CreateServiceCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServiceCategoryVariables): MutationRef<CreateServiceCategoryData, CreateServiceCategoryVariables>;
  operationName: string;
}
export const createServiceCategoryRef: CreateServiceCategoryRef;

export function createServiceCategory(vars: CreateServiceCategoryVariables): MutationPromise<CreateServiceCategoryData, CreateServiceCategoryVariables>;
export function createServiceCategory(dc: DataConnect, vars: CreateServiceCategoryVariables): MutationPromise<CreateServiceCategoryData, CreateServiceCategoryVariables>;

interface UpdateServiceCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceCategoryVariables): MutationRef<UpdateServiceCategoryData, UpdateServiceCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateServiceCategoryVariables): MutationRef<UpdateServiceCategoryData, UpdateServiceCategoryVariables>;
  operationName: string;
}
export const updateServiceCategoryRef: UpdateServiceCategoryRef;

export function updateServiceCategory(vars: UpdateServiceCategoryVariables): MutationPromise<UpdateServiceCategoryData, UpdateServiceCategoryVariables>;
export function updateServiceCategory(dc: DataConnect, vars: UpdateServiceCategoryVariables): MutationPromise<UpdateServiceCategoryData, UpdateServiceCategoryVariables>;

interface DeleteServiceCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceCategoryVariables): MutationRef<DeleteServiceCategoryData, DeleteServiceCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteServiceCategoryVariables): MutationRef<DeleteServiceCategoryData, DeleteServiceCategoryVariables>;
  operationName: string;
}
export const deleteServiceCategoryRef: DeleteServiceCategoryRef;

export function deleteServiceCategory(vars: DeleteServiceCategoryVariables): MutationPromise<DeleteServiceCategoryData, DeleteServiceCategoryVariables>;
export function deleteServiceCategory(dc: DataConnect, vars: DeleteServiceCategoryVariables): MutationPromise<DeleteServiceCategoryData, DeleteServiceCategoryVariables>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;
export function getUser(dc: DataConnect, vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;

interface ListBookingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBookingsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListBookingsData, undefined>;
  operationName: string;
}
export const listBookingsRef: ListBookingsRef;

export function listBookings(options?: ExecuteQueryOptions): QueryPromise<ListBookingsData, undefined>;
export function listBookings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListBookingsData, undefined>;

interface GetBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBookingVariables): QueryRef<GetBookingData, GetBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBookingVariables): QueryRef<GetBookingData, GetBookingVariables>;
  operationName: string;
}
export const getBookingRef: GetBookingRef;

export function getBooking(vars: GetBookingVariables, options?: ExecuteQueryOptions): QueryPromise<GetBookingData, GetBookingVariables>;
export function getBooking(dc: DataConnect, vars: GetBookingVariables, options?: ExecuteQueryOptions): QueryPromise<GetBookingData, GetBookingVariables>;

interface ListReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListReviewsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListReviewsData, undefined>;
  operationName: string;
}
export const listReviewsRef: ListReviewsRef;

export function listReviews(options?: ExecuteQueryOptions): QueryPromise<ListReviewsData, undefined>;
export function listReviews(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListReviewsData, undefined>;

interface ListNotificationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListNotificationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListNotificationsData, undefined>;
  operationName: string;
}
export const listNotificationsRef: ListNotificationsRef;

export function listNotifications(options?: ExecuteQueryOptions): QueryPromise<ListNotificationsData, undefined>;
export function listNotifications(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListNotificationsData, undefined>;

interface ListServiceCategoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListServiceCategoriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListServiceCategoriesData, undefined>;
  operationName: string;
}
export const listServiceCategoriesRef: ListServiceCategoriesRef;

export function listServiceCategories(options?: ExecuteQueryOptions): QueryPromise<ListServiceCategoriesData, undefined>;
export function listServiceCategories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListServiceCategoriesData, undefined>;

