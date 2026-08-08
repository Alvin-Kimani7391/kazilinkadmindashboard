# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, updateUser, deleteUser, updateBookingStatus, deleteBooking, deleteReview, markNotificationRead, deleteNotification, createServiceCategory, updateServiceCategory } from '@dataconnect/admin-generated';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation UpdateUser:  For variables, look at type UpdateUserVars in ../index.d.ts
const { data } = await UpdateUser(dataConnect, updateUserVars);

// Operation DeleteUser:  For variables, look at type DeleteUserVars in ../index.d.ts
const { data } = await DeleteUser(dataConnect, deleteUserVars);

// Operation UpdateBookingStatus:  For variables, look at type UpdateBookingStatusVars in ../index.d.ts
const { data } = await UpdateBookingStatus(dataConnect, updateBookingStatusVars);

// Operation DeleteBooking:  For variables, look at type DeleteBookingVars in ../index.d.ts
const { data } = await DeleteBooking(dataConnect, deleteBookingVars);

// Operation DeleteReview:  For variables, look at type DeleteReviewVars in ../index.d.ts
const { data } = await DeleteReview(dataConnect, deleteReviewVars);

// Operation MarkNotificationRead:  For variables, look at type MarkNotificationReadVars in ../index.d.ts
const { data } = await MarkNotificationRead(dataConnect, markNotificationReadVars);

// Operation DeleteNotification:  For variables, look at type DeleteNotificationVars in ../index.d.ts
const { data } = await DeleteNotification(dataConnect, deleteNotificationVars);

// Operation CreateServiceCategory:  For variables, look at type CreateServiceCategoryVars in ../index.d.ts
const { data } = await CreateServiceCategory(dataConnect, createServiceCategoryVars);

// Operation UpdateServiceCategory:  For variables, look at type UpdateServiceCategoryVars in ../index.d.ts
const { data } = await UpdateServiceCategory(dataConnect, updateServiceCategoryVars);


```