package com.gui.deskBooking.mapper;

import com.gui.deskBooking.domain.DeskBooking;
import com.gui.deskBooking.dto.BookingResponse;
import com.gui.integrations.hr.dto.EmployeeDto;
import com.gui.integrations.office.dto.DeskDto;
import org.springframework.stereotype.Component;

@Component
public class DeskBookingMapper {

    public BookingResponse toResponse(DeskBooking booking, DeskDto desk, EmployeeDto employee) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setDeskId(booking.getDeskId());
        response.setDeskLabel(desk != null ? desk.getLabel() : booking.getDeskId());
        response.setEmployeeId(booking.getEmployeeId());
        response.setEmployeeName(employee != null ? employee.getName() : booking.getEmployeeId());
        response.setDate(booking.getDate());
        response.setStatus(booking.getStatus().name());
        return response;
    }
}