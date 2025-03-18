export default function LoteModal({ open, onClose }) {
    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        p: 3,
                        backgroundColor: 'white',
                        maxWidth: 500,
                        margin: 'auto',
                        mt: 5,
                        borderRadius: 2,
                    }}
                ></Box>
            </Modal>
        </>
    )
}