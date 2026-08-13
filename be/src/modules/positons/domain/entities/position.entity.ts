export class Position {
    /**
     * Entity đại diện cho một đối tượng Vị trí công việc.
     * Nó chứa các thuộc tính và logic nghiệp vụ bên trong của một vị trí,
     * không chịu trách nhiệm cho việc truy vấn hay lấy danh sách các vị trí khác.
     */

    constructor(
        public readonly id: number | null,
        public title: string,
        public dept_id: number,
        public base_salary: number | null,
    ) { }

    /**
     * Factory method để tạo một vị trí công việc mới.
     * @param data Dữ liệu để tạo vị trí mới, thường từ CreatePositionDto.
     * @returns Một thực thể Position mới.
     */
    public static createNew(data: { title: string; dept_id: number; base_salary?: number | null }): Position {
        if (!data.title || data.title.trim() === '') {
            throw new Error('Tiêu đề vị trí không được để trống.');
        }
        return new Position(
            null,
            data.title,
            data.dept_id,
            data.base_salary ?? null,
        );
    }

    /**
     * Cập nhật thông tin của vị trí công việc.
     * @param data Dữ liệu để cập nhật, thường từ UpdatePositionDto.
     */
    public updateInfo(data: { title?: string; dept_id?: number; base_salary?: number | null }) {
        if (data.title !== undefined && data.title.trim() !== '') {
            this.title = data.title;
        }
        if (data.dept_id !== undefined) {
            this.dept_id = data.dept_id;
        }
        if (data.base_salary !== undefined) {
            this.base_salary = data.base_salary;
        }
    }
}
