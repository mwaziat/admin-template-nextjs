import Swal from 'sweetalert2'

export const DeleteConfirm = (message: string, onDelete: () => Promise<boolean>) => {
  Swal.fire({
    title: "Are you sure?",
    text: `${message}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      onDelete().then((success) => {
        if (success) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        } else {
          Swal.fire({
            title: "Failed!",
            text: "There was an error deleting your file.",
            icon: "error"
          });
        }
      });
    }
  });
}