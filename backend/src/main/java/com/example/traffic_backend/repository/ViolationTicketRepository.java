package com.example.traffic_backend.repository;

import com.example.traffic_backend.entity.User;
import com.example.traffic_backend.entity.Vehicle;
import com.example.traffic_backend.entity.ViolationTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.traffic_backend.dto.*;
import java.util.List;

public interface ViolationTicketRepository
        extends JpaRepository<ViolationTicket, Long> {

    List<ViolationTicket> findByVehicleOwner(User owner);

    List<ViolationTicket> findByIssuedBy(User officer);

    List<ViolationTicket> findByVehicle(Vehicle vehicle);
    @Query("""
       SELECT SUM(p.amount)
       FROM PaymentTransaction p
       WHERE p.paymentStatus =
       com.example.traffic_backend.enums.PaymentStatus.SUCCESS
       """)
Double getTotalFineCollected();
@Query("""
       SELECT COUNT(t)
       FROM ViolationTicket t
       WHERE t.ticketStatus <>
       com.example.traffic_backend.enums.TicketStatus.PAID
       """)
Long getTotalUnpaidTickets();
@Query("""
       SELECT new com.example.traffic_backend.dto.
       TicketStatusSummaryDTO(
           t.ticketStatus,
           COUNT(t)
       )
       FROM ViolationTicket t
       GROUP BY t.ticketStatus
       """)
List<TicketStatusSummaryDTO>
getTicketStatusSummary();
@Query("""
       SELECT new com.example.traffic_backend.dto.
       MostCommonViolationDTO(
           v.violationName,
           COUNT(t)
       )
       FROM ViolationTicket t
       JOIN t.violationType v
       GROUP BY v.violationName
       ORDER BY COUNT(t) DESC
       """)
List<MostCommonViolationDTO>
getMostCommonViolation();
@Query("""
       SELECT new com.example.traffic_backend.dto.
       RevenueByViolationDTO(
           v.violationName,
           SUM(p.amount)
       )
       FROM PaymentTransaction p
       JOIN p.violationTicket t
       JOIN t.violationType v
       WHERE p.paymentStatus =
       com.example.traffic_backend.enums.PaymentStatus.SUCCESS
       GROUP BY v.violationName
       """)
List<RevenueByViolationDTO>
getRevenueByViolation();
}